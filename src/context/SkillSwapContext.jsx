import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { hasSupabaseEnv, supabase } from "../lib/supabase";

const SkillSwapContext = createContext(null);

const BASE_USER = {
  id: null,
  name: "SkillSwap User",
  bio: "",
  city: "",
  level: "Beginner",
  availability: "2-5 hours / week",
  teachSkills: ["Sewing"],
  learnSkills: ["Drawing"],
};

const intersects = (a, b) => a.filter((value) => b.includes(value));

const getSortedPair = (a, b) => (a < b ? [a, b] : [b, a]);

const toRelativeTime = (isoLike) => {
  const now = new Date();
  const then = new Date(isoLike);
  const diffMs = now - then;
  const mins = Math.max(1, Math.round(diffMs / 60000));

  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export const SkillSwapProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(BASE_USER);
  const [myProfileId, setMyProfileId] = useState(null);
  const [candidateProfiles, setCandidateProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [swipes, setSwipes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [messagesByMatch, setMessagesByMatch] = useState({});

  const useDatabase = Boolean(user && hasSupabaseEnv && supabase);

  const getCompatibility = (candidate) => {
    const teachOverlap = intersects(
      candidate.teachSkills,
      currentUser.learnSkills,
    );
    const learnOverlap = intersects(
      candidate.learnSkills,
      currentUser.teachSkills,
    );

    const cityBonus = candidate.city === currentUser.city ? 1 : 0;
    const levelBonus = candidate.level === currentUser.level ? 1 : 0;
    const score =
      teachOverlap.length * 2 +
      learnOverlap.length * 2 +
      cityBonus +
      levelBonus;
    const hasTeachMatch = teachOverlap.length > 0;
    const hasLearnMatch = learnOverlap.length > 0;
    const isCompatible = hasTeachMatch && hasLearnMatch;
    const isPartiallyCompatible = hasTeachMatch || hasLearnMatch;
    const percentBase = isCompatible ? 56 : 40;
    const percent = Math.min(98, percentBase + score * 7);

    return {
      score,
      percent,
      teachOverlap,
      learnOverlap,
      cityBonus,
      levelBonus,
      hasTeachMatch,
      hasLearnMatch,
      isCompatible,
      isPartiallyCompatible,
    };
  };

  const swipeMap = useMemo(() => {
    const map = new Map();
    swipes.forEach((item) =>
      map.set(item.target_profile_id || item.targetId, item.action),
    );
    return map;
  }, [swipes]);

  // Takes the current user's profile id explicitly so we never read stale
  // React state (which would be null on first load and misattribute all
  // messages as coming from the partner).
  const hydrateMessages = (messageRows, profileMap, currentProfileId) => {
    return messageRows.reduce((acc, row) => {
      const sender =
        row.sender_profile_id === currentProfileId
          ? "You"
          : profileMap[row.sender_profile_id]?.name || "Partner";
      if (!acc[row.match_id]) acc[row.match_id] = [];
      acc[row.match_id].push({
        sender,
        text: row.body,
        createdAt: row.created_at,
      });
      return acc;
    }, {});
  };

  const ensureProfile = async () => {
    if (!useDatabase) return null;

    const { data: existing, error: existingError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      return existing;
    }

    const draft = {
      auth_user_id: user.id,
      email: user.email,
      name:
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "SkillSwap User",
      bio: BASE_USER.bio,
      city: BASE_USER.city,
      level: BASE_USER.level,
      availability: BASE_USER.availability,
      teach_skills: BASE_USER.teachSkills,
      learn_skills: BASE_USER.learnSkills,
      is_demo: false,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("profiles")
      .insert(draft)
      .select("*")
      .single();

    if (insertError) throw insertError;
    return inserted;
  };

  const loadFromDatabase = async () => {
    if (!useDatabase) {
      setCurrentUser(BASE_USER);
      setMyProfileId(null);
      setCandidateProfiles([]);
      setSwipes([]);
      setMatches([]);
      setMessagesByMatch({});
      return;
    }

    setLoading(true);
    setError("");

    try {
      const myProfile = await ensureProfile();
      setMyProfileId(myProfile.id);
      myProfileIdRef.current = myProfile.id;
      setCurrentUser({
        id: myProfile.id,
        name: myProfile.name,
        bio: myProfile.bio || "",
        city: myProfile.city || "",
        level: myProfile.level || "Beginner",
        availability: myProfile.availability || "2-5 hours / week",
        teachSkills: myProfile.teach_skills || [],
        learnSkills: myProfile.learn_skills || [],
      });

      const [profilesRes, swipesRes, matchesRes] = await Promise.all([
        supabase.from("profiles").select("*").neq("id", myProfile.id),
        supabase
          .from("swipes")
          .select("*")
          .eq("swiper_profile_id", myProfile.id),
        supabase
          .from("matches")
          .select("*")
          .or(`profile_a_id.eq.${myProfile.id},profile_b_id.eq.${myProfile.id}`)
          .order("created_at", { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (swipesRes.error) throw swipesRes.error;
      if (matchesRes.error) throw matchesRes.error;

      const profileRows = profilesRes.data || [];
      const profileMap = profileRows.reduce(
        (acc, row) => ({
          ...acc,
          [row.id]: row,
        }),
        { [myProfile.id]: myProfile },
      );
      // Keep ref in sync so the realtime handler always has fresh names.
      profileMapRef.current = profileMap;

      setCandidateProfiles(profileRows);
      setSwipes(swipesRes.data || []);

      const rawMatches = matchesRes.data || [];
      setMatches(
        rawMatches.map((match) => {
          const otherId =
            match.profile_a_id === myProfile.id
              ? match.profile_b_id
              : match.profile_a_id;
          const otherProfile = profileMap[otherId];
          return {
            ...match,
            userId: otherId,
            name: otherProfile?.name || "Partner",
            city: otherProfile?.city || "",
          };
        }),
      );

      if (!rawMatches.length) {
        setMessagesByMatch({});
      } else {
        const matchIds = rawMatches.map((item) => item.id);
        const { data: messageRows, error: messageError } = await supabase
          .from("messages")
          .select("*")
          .in("match_id", matchIds)
          .order("created_at", { ascending: true });

        if (messageError) throw messageError;
        // Pass myProfile.id directly — React state (myProfileId) is still the
        // previous value at this point in the render cycle.
        setMessagesByMatch(hydrateMessages(messageRows || [], profileMap, myProfile.id));
      }
    } catch (err) {
      setError(err.message || "Failed to load SkillSwap data.");
    } finally {
      setLoading(false);
    }
  };

  // Keep a ref to the current profileMap so the realtime handler can look up
  // sender names without capturing stale closures.
  const profileMapRef = useRef({});
  const myProfileIdRef = useRef(null);

  useEffect(() => {
    loadFromDatabase();
  }, [user?.id]);

  // Supabase Realtime subscription — listens for new messages in any match
  // that belongs to the current user and appends them to local state so the
  // other participant's messages appear instantly without a reload.
  useEffect(() => {
    if (!useDatabase) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new;
          const profileId = myProfileIdRef.current;
          // Ignore messages we inserted ourselves (already added optimistically)
          if (row.sender_profile_id === profileId) return;

          const senderName =
            profileMapRef.current[row.sender_profile_id]?.name || "Partner";

          setMessagesByMatch((prev) => {
            const existing = prev[row.match_id] || [];
            return {
              ...prev,
              [row.match_id]: [
                ...existing,
                {
                  sender: senderName,
                  text: row.body,
                  createdAt: row.created_at,
                },
              ],
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [useDatabase]);

  const discoverQueue = useMemo(() => {
    const candidates = candidateProfiles
      .map((row) => ({
        id: row.id,
        name: row.name,
        city: row.city,
        bio: row.bio,
        teachSkills: row.teach_skills || [],
        learnSkills: row.learn_skills || [],
        level: row.level,
        availability: row.availability,
        likesYou: row.likes_you,
        compatibility: getCompatibility({
          teachSkills: row.teach_skills || [],
          learnSkills: row.learn_skills || [],
          city: row.city,
          level: row.level,
        }),
      }))
      .filter((candidate) => !swipeMap.has(candidate.id))
      .sort((a, b) => b.compatibility.percent - a.compatibility.percent);

    const strict = candidates
      .filter((candidate) => candidate.compatibility.isCompatible)
      .map((candidate) => ({ ...candidate, matchMode: "mutual" }));

    if (strict.length > 0) return strict;

    return candidates
      .filter((candidate) => candidate.compatibility.isPartiallyCompatible)
      .map((candidate) => ({ ...candidate, matchMode: "partial" }));
  }, [swipeMap, currentUser, candidateProfiles]);

  const resetDiscoverSwipes = async () => {
    if (!useDatabase || !myProfileId) return;

    const { error: deleteError } = await supabase
      .from("swipes")
      .delete()
      .eq("swiper_profile_id", myProfileId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setSwipes([]);
    await loadFromDatabase();
    setError("");
  };

  const performSwipe = async (targetId, action) => {
    if (!useDatabase || !myProfileId) return;

    const candidate = discoverQueue.find((item) => item.id === targetId);
    if (!candidate) return;

    const { data: swipeRow, error: swipeError } = await supabase
      .from("swipes")
      .upsert(
        {
          swiper_profile_id: myProfileId,
          target_profile_id: targetId,
          action,
        },
        { onConflict: "swiper_profile_id,target_profile_id" },
      )
      .select("*")
      .single();

    if (swipeError) {
      setError(swipeError.message);
      return;
    }

    setSwipes((prev) => {
      const existing = prev.find((item) => item.target_profile_id === targetId);
      if (!existing) return [...prev, swipeRow];
      return prev.map((item) =>
        item.target_profile_id === targetId ? swipeRow : item,
      );
    });

    if (action !== "right") return;

    let shouldCreateMatch = Boolean(candidate.likesYou);

    if (!shouldCreateMatch) {
      const { data: reverseSwipe } = await supabase
        .from("swipes")
        .select("id")
        .eq("swiper_profile_id", targetId)
        .eq("target_profile_id", myProfileId)
        .eq("action", "right")
        .maybeSingle();

      shouldCreateMatch = Boolean(reverseSwipe);
    }

    if (!shouldCreateMatch) return;

    const [profileA, profileB] = getSortedPair(myProfileId, targetId);

    const { data: existingMatch } = await supabase
      .from("matches")
      .select("*")
      .eq("profile_a_id", profileA)
      .eq("profile_b_id", profileB)
      .maybeSingle();

    if (existingMatch) {
      await loadFromDatabase();
      return;
    }

    const { error: matchError } = await supabase.from("matches").insert({
      profile_a_id: profileA,
      profile_b_id: profileB,
      status: "Active",
      agreement: `${candidate.compatibility.teachOverlap[0] || candidate.teachSkills[0] || "a skill"} <-> ${candidate.compatibility.learnOverlap[0] || candidate.learnSkills[0] || "a skill"}`,
    });

    if (matchError) {
      setError(matchError.message);
      return;
    }

    await loadFromDatabase();
  };

  const sendMessage = async (matchId, text) => {
    if (!text.trim()) return;
    if (!useDatabase || !myProfileId) return;

    const { data, error: insertError } = await supabase
      .from("messages")
      .insert({
        match_id: matchId,
        sender_profile_id: myProfileId,
        body: text.trim(),
      })
      .select("*")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setMessagesByMatch((prev) => {
      const existing = prev[matchId] || [];
      return {
        ...prev,
        [matchId]: [
          ...existing,
          {
            sender: "You",
            text: text.trim(),
            createdAt: data.created_at,
          },
        ],
      };
    });
  };

  const updateCurrentUser = async (updates) => {
    if (!useDatabase || !myProfileId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
      return;
    }

    const payload = {
      name: updates.name,
      bio: updates.bio,
      city: updates.city,
      level: updates.level,
      availability: updates.availability,
      teach_skills: updates.teachSkills,
      learn_skills: updates.learnSkills,
    };

    const { error: updateError } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", myProfileId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCurrentUser((prev) => ({ ...prev, ...updates }));
    await loadFromDatabase();
  };

  const enrichedMatches = useMemo(() => {
    return matches.map((match) => {
      const messageList = messagesByMatch[match.id] || [];
      const lastMessage = messageList[messageList.length - 1];

      return {
        ...match,
        messages: messageList,
        lastMessagePreview: lastMessage
          ? `${lastMessage.sender}: ${lastMessage.text}`
          : "No messages yet",
        updatedAtRelative: lastMessage
          ? toRelativeTime(lastMessage.createdAt)
          : toRelativeTime(match.createdAt),
      };
    });
  }, [matches, messagesByMatch]);

  const value = {
    currentUser,
    setCurrentUser: updateCurrentUser,
    discoverQueue,
    performSwipe,
    matches: enrichedMatches,
    sendMessage,
    swipes,
    loading,
    error,
    refreshData: loadFromDatabase,
    resetDiscoverSwipes,
  };

  return (
    <SkillSwapContext.Provider value={value}>
      {children}
    </SkillSwapContext.Provider>
  );
};

export const useSkillSwap = () => {
  const context = useContext(SkillSwapContext);
  if (!context) {
    throw new Error("useSkillSwap must be used within SkillSwapProvider");
  }
  return context;
};
