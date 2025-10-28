export const workoutDatabase = [
  // ===== PHYSICAL THERAPY EXERCISES =====
  {
    id: 1,
    name: "Knee Flexion Stretch",
    targetMuscles: ["Hamstrings", "Knee Joint"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    category: "Physical Therapy",
    description: "A gentle rehabilitation exercise for improving knee range of motion after injury or surgery.",
    tips: [
      "Sit on the edge of a chair or bed",
      "Slowly bend your knee as far as comfortable",
      "Hold the stretch for 5-10 seconds",
      "Return to starting position slowly"
    ],
    commonMistakes: [
      "Moving too quickly",
      "Forcing the knee beyond comfortable range",
      "Not breathing properly during the stretch",
      "Skipping warm-up"
    ],
    safetyTips: "Pain scale should be 0-3/10. Sharp pain means stop immediately.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      kneeAngle: { min: 90, max: 120 }
    }
  },
  {
    id: 2,
    name: "Shoulder Pendulum",
    targetMuscles: ["Shoulder Joint", "Rotator Cuff"],
    difficulty: "Beginner",
    thumbnail: "💪",
    category: "Physical Therapy",
    description: "A passive range of motion exercise for shoulder rehabilitation, especially after injury or surgery.",
    tips: [
      "Lean forward supporting yourself with good arm",
      "Let injured arm hang down relaxed",
      "Gently swing arm in small circles",
      "Gradually increase circle size as tolerated"
    ],
    commonMistakes: [
      "Using muscles to swing (should be gravity-driven)",
      "Making circles too large too soon",
      "Tensing the shoulder",
      "Moving too fast"
    ],
    safetyTips: "This should be pain-free. If you feel pain, reduce the range of motion.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      shoulderAngle: { min: 85, max: 100 }
    }
  },
  {
    id: 3,
    name: "Ankle Alphabet",
    targetMuscles: ["Ankle Joint", "Calf"],
    difficulty: "Beginner",
    thumbnail: "🦶",
    category: "Physical Therapy",
    description: "Range of motion exercise for ankle rehabilitation, improving flexibility and strength.",
    tips: [
      "Sit comfortably with leg extended",
      "Use your big toe to 'write' letters A-Z in the air",
      "Move only from the ankle joint",
      "Keep movements slow and controlled"
    ],
    commonMistakes: [
      "Moving from the knee instead of ankle",
      "Making letters too small",
      "Moving too quickly",
      "Not completing full alphabet"
    ],
    safetyTips: "Should feel gentle stretch, not pain. Start with capital letters.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      ankleAngle: { min: 70, max: 110 }
    }
  },
  {
    id: 4,
    name: "Quad Sets",
    targetMuscles: ["Quadriceps"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    category: "Physical Therapy",
    description: "Isometric strengthening exercise for the quadriceps, often first exercise after knee injury/surgery.",
    tips: [
      "Sit or lie with leg extended",
      "Tighten thigh muscle pushing knee down",
      "Hold contraction for 5 seconds",
      "Relax and repeat"
    ],
    commonMistakes: [
      "Not fully contracting the muscle",
      "Holding breath during contraction",
      "Lifting the leg",
      "Rushing through repetitions"
    ],
    safetyTips: "Place small towel roll under knee if extension is uncomfortable.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      kneeAngle: { min: 175, max: 180 }
    }
  },
  {
    id: 5,
    name: "Wall Slides",
    targetMuscles: ["Shoulders", "Upper Back", "Posture Muscles"],
    difficulty: "Beginner",
    thumbnail: "🧍",
    category: "Physical Therapy",
    description: "Postural exercise that strengthens shoulder blade muscles and improves upper body alignment.",
    tips: [
      "Stand with back against wall",
      "Arms in 'goalpost' position against wall",
      "Slide arms up while maintaining contact with wall",
      "Lower back down slowly"
    ],
    commonMistakes: [
      "Lower back arching away from wall",
      "Losing arm contact with wall",
      "Shoulders shrugging up",
      "Moving too fast"
    ],
    safetyTips: "Keep movements slow and controlled. Should feel muscle work, not joint pain.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      shoulderAngle: { min: 90, max: 170 },
      elbowAngle: { min: 85, max: 90 }
    }
  },
  {
    id: 6,
    name: "Hip Bridges",
    targetMuscles: ["Glutes", "Hamstrings", "Lower Back"],
    difficulty: "Beginner",
    thumbnail: "🏋️",
    category: "Physical Therapy",
    description: "Strengthening exercise for lower back pain and hip stability.",
    tips: [
      "Lie on back with knees bent, feet flat",
      "Squeeze glutes and lift hips up",
      "Form straight line from knees to shoulders",
      "Lower down slowly with control"
    ],
    commonMistakes: [
      "Lifting too high (hyperextending back)",
      "Not engaging glutes",
      "Pushing through toes instead of heels",
      "Moving too quickly"
    ],
    safetyTips: "Stop if you feel lower back pain. Focus on glute engagement, not height.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      hipAngle: { min: 170, max: 180 },
      kneeAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 7,
    name: "Seated Row (Resistance Band)",
    targetMuscles: ["Upper Back", "Rhomboids", "Biceps"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    category: "Physical Therapy",
    description: "Strengthening exercise for upper back and posture correction using resistance band.",
    tips: [
      "Sit with legs extended, band around feet",
      "Pull band toward waist keeping elbows close",
      "Squeeze shoulder blades together",
      "Return to start with control"
    ],
    commonMistakes: [
      "Using momentum instead of muscle",
      "Rounding shoulders forward",
      "Pulling with arms instead of back",
      "Not maintaining upright posture"
    ],
    safetyTips: "Start with light resistance. Breathe out during pull, in during release.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      elbowAngle: { min: 70, max: 90 },
      shoulderAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 8,
    name: "Calf Raises",
    targetMuscles: ["Calves", "Achilles Tendon"],
    difficulty: "Beginner",
    thumbnail: "🦶",
    category: "Physical Therapy",
    description: "Strengthening exercise for calf muscles and Achilles tendon rehabilitation.",
    tips: [
      "Stand with feet hip-width apart",
      "Rise up onto balls of feet",
      "Hold at top for 2 seconds",
      "Lower down slowly with control"
    ],
    commonMistakes: [
      "Using momentum to bounce",
      "Not lifting high enough",
      "Lowering too quickly",
      "Leaning forward or backward"
    ],
    safetyTips: "Hold onto support for balance if needed. Progress to single leg when ready.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      ankleAngle: { min: 110, max: 130 }
    }
  },
  {
    id: 9,
    name: "Bird Dog",
    targetMuscles: ["Core", "Lower Back", "Glutes"],
    difficulty: "Intermediate",
    thumbnail: "🐕",
    category: "Physical Therapy",
    description: "Core stabilization exercise that improves balance and spinal stability.",
    tips: [
      "Start on hands and knees (tabletop position)",
      "Extend opposite arm and leg simultaneously",
      "Keep hips level and spine neutral",
      "Hold for 5 seconds then switch"
    ],
    commonMistakes: [
      "Rotating hips or shoulders",
      "Arching or rounding back",
      "Looking up (neck hyperextension)",
      "Moving too quickly"
    ],
    safetyTips: "Master the movement with just arm or just leg before combining both.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      hipAngle: { min: 170, max: 180 },
      shoulderAngle: { min: 170, max: 180 }
    }
  },
  {
    id: 10,
    name: "Lateral Leg Raises",
    targetMuscles: ["Hip Abductors", "Glutes"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    category: "Physical Therapy",
    description: "Hip strengthening exercise for improving stability and preventing injuries.",
    tips: [
      "Lie on side with legs stacked",
      "Lift top leg up keeping it straight",
      "Hold for 2 seconds at top",
      "Lower down with control"
    ],
    commonMistakes: [
      "Rolling hips backward or forward",
      "Bending the knee",
      "Lifting too high (compensating)",
      "Using momentum"
    ],
    safetyTips: "Keep movement slow and controlled. Should feel work in side of hip.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    idealAngles: {
      hipAngle: { min: 30, max: 45 }
    }
  },
  
  // ===== ORIGINAL FITNESS EXERCISES =====
  {
    id: 11,
    name: "Squat",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    difficulty: "Beginner",
    thumbnail: "🏋️",
    category: "Strength Training",
    description: "A fundamental lower body exercise that targets your legs and glutes.",
    tips: [
      "Keep your feet shoulder-width apart",
      "Keep your spine neutral throughout the movement",
      "Lower until your thighs are parallel to the floor",
      "Push through your heels to stand up"
    ],
    commonMistakes: [
      "Knees caving inward",
      "Rounding the back",
      "Not going deep enough",
      "Lifting heels off the ground"
    ],
    safetyTips: "Stop immediately if you feel pain in your knees or lower back.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 12,
    name: "Bench Press",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    difficulty: "Intermediate",
    category: "Strength Training",
    thumbnail: "💪",
    description: "A classic upper body exercise for building chest strength.",
    tips: [
      "Keep your shoulder blades retracted",
      "Lower the bar to your chest with control",
      "Press up in a straight line",
      "Keep your feet flat on the floor"
    ],
    commonMistakes: [
      "Bouncing the bar off chest",
      "Flaring elbows too wide",
      "Arching back excessively",
      "Lifting feet off ground"
    ],
    safetyTips: "Always use a spotter and start with lighter weights to perfect form.",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    idealAngles: {
      elbowAngle: { min: 70, max: 90 },
      shoulderAngle: { min: 80, max: 100 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 3,
    name: "Deadlift",
    targetMuscles: ["Hamstrings", "Glutes", "Back", "Traps"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "A compound movement that works your entire posterior chain.",
    tips: [
      "Keep the bar close to your body",
      "Maintain a neutral spine",
      "Drive through your heels",
      "Stand up tall at the top"
    ],
    commonMistakes: [
      "Rounding the back",
      "Bar drifting away from body",
      "Not engaging core",
      "Hyperextending at the top"
    ],
    safetyTips: "Start with lighter weights and focus on perfect form before increasing load.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      kneeAngle: { min: 70, max: 90 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 4,
    name: "Shoulder Press",
    targetMuscles: ["Shoulders", "Triceps"],
    difficulty: "Beginner",
    thumbnail: "💪",
    description: "An overhead pressing movement for shoulder development.",
    tips: [
      "Start with dumbbells at shoulder level",
      "Press straight up overhead",
      "Keep core engaged",
      "Lower with control"
    ],
    commonMistakes: [
      "Pressing forward instead of up",
      "Not engaging core",
      "Using too much weight",
      "Arching back excessively"
    ],
    safetyTips: "Start with lighter weights and ensure proper shoulder mobility.",
    videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 5,
    name: "Lat Pulldown",
    targetMuscles: ["Lats", "Rhomboids", "Biceps"],
    difficulty: "Beginner",
    thumbnail: "🏋️‍♀️",
    description: "A pulling exercise that targets your back muscles.",
    tips: [
      "Pull the bar to your upper chest",
      "Squeeze your shoulder blades together",
      "Control the weight on the way up",
      "Keep your chest up"
    ],
    commonMistakes: [
      "Pulling behind the neck",
      "Using momentum",
      "Not engaging lats",
      "Leaning back too much"
    ],
    safetyTips: "Focus on controlled movement and proper shoulder positioning.",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 6,
    name: "Bicep Curl",
    targetMuscles: ["Biceps"],
    difficulty: "Beginner",
    thumbnail: "💪",
    description: "An isolation exercise for bicep development.",
    tips: [
      "Keep elbows close to your sides",
      "Curl the weight up slowly",
      "Squeeze at the top",
      "Lower with control"
    ],
    commonMistakes: [
      "Swinging the weight",
      "Moving elbows forward",
      "Not controlling the descent",
      "Using too much weight"
    ],
    safetyTips: "Use controlled movements and avoid momentum.",
    videoUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 85, max: 95 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 7,
    name: "Tricep Dips",
    targetMuscles: ["Triceps", "Chest"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A bodyweight exercise for tricep and chest development.",
    tips: [
      "Keep your body close to the bench",
      "Lower until elbows are at 90 degrees",
      "Press up using triceps",
      "Keep core engaged"
    ],
    commonMistakes: [
      "Going too deep",
      "Flaring elbows out",
      "Not engaging core",
      "Using legs too much"
    ],
    safetyTips: "Start with assisted dips if needed and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=6kALZikXxLc",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 70, max: 90 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 8,
    name: "Lunges",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    difficulty: "Beginner",
    thumbnail: "🏃‍♂️",
    description: "A unilateral leg exercise for strength and balance.",
    tips: [
      "Step forward into a lunge position",
      "Lower until both knees are at 90 degrees",
      "Push back to starting position",
      "Keep your torso upright"
    ],
    commonMistakes: [
      "Knee going past toes",
      "Leaning forward too much",
      "Not going deep enough",
      "Losing balance"
    ],
    safetyTips: "Start with bodyweight and focus on balance before adding weight.",
    videoUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
    idealAngles: {
      frontKneeAngle: { min: 80, max: 100 },
      backKneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 }
    }
  },
  {
    id: 9,
    name: "Push-ups",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    difficulty: "Beginner",
    thumbnail: "💪",
    description: "A classic bodyweight exercise for upper body strength.",
    tips: [
      "Keep your body in a straight line",
      "Lower your chest to the ground",
      "Push up explosively",
      "Keep core engaged"
    ],
    commonMistakes: [
      "Sagging hips",
      "Not going low enough",
      "Flaring elbows too wide",
      "Looking up instead of down"
    ],
    safetyTips: "Start with modified push-ups if needed and progress gradually.",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    idealAngles: {
      elbowAngle: { min: 70, max: 90 },
      shoulderAngle: { min: 80, max: 100 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 10,
    name: "Pull-ups",
    targetMuscles: ["Lats", "Rhomboids", "Biceps"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "An advanced bodyweight pulling exercise.",
    tips: [
      "Hang with arms fully extended",
      "Pull your chest to the bar",
      "Lower with control",
      "Engage your lats"
    ],
    commonMistakes: [
      "Not going full range of motion",
      "Using momentum",
      "Not engaging lats",
      "Rushing the movement"
    ],
    safetyTips: "Start with assisted pull-ups or negative pull-ups if needed.",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 11,
    name: "Romanian Deadlift",
    targetMuscles: ["Hamstrings", "Glutes"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♀️",
    description: "A hip-hinge movement focusing on the posterior chain.",
    tips: [
      "Keep legs relatively straight",
      "Hinge at the hips",
      "Feel stretch in hamstrings",
      "Drive hips forward to stand"
    ],
    commonMistakes: [
      "Rounding the back",
      "Bending knees too much",
      "Not feeling hamstring stretch",
      "Going too heavy too soon"
    ],
    safetyTips: "Start with lighter weights and focus on the hip hinge movement.",
    videoUrl: "https://www.youtube.com/watch?v=js8ZP_ljU5A",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      kneeAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 12,
    name: "Overhead Press",
    targetMuscles: ["Shoulders", "Triceps", "Core"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A standing overhead pressing movement.",
    tips: [
      "Start with bar at shoulder level",
      "Press straight up overhead",
      "Keep core tight",
      "Lower with control"
    ],
    commonMistakes: [
      "Pressing forward",
      "Not engaging core",
      "Using too much weight",
      "Arching back excessively"
    ],
    safetyTips: "Ensure proper shoulder mobility and start with lighter weights.",
    videoUrl: "https://www.youtube.com/watch?v=5y6hVzU6U0s",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 13,
    name: "Bent-Over Row",
    targetMuscles: ["Lats", "Rhomboids", "Rear Delts"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♂️",
    description: "A pulling exercise performed bent over.",
    tips: [
      "Hinge at hips with slight knee bend",
      "Pull elbows back",
      "Squeeze shoulder blades",
      "Keep chest up"
    ],
    commonMistakes: [
      "Rounding the back",
      "Using momentum",
      "Not squeezing shoulder blades",
      "Going too heavy"
    ],
    safetyTips: "Focus on proper hip hinge and controlled movement.",
    videoUrl: "https://www.youtube.com/watch?v=9efgcAjQe7E",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      shoulderAngle: { min: 70, max: 90 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 14,
    name: "Calf Raises",
    targetMuscles: ["Calves"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    description: "An isolation exercise for calf development.",
    tips: [
      "Stand on edge of step",
      "Rise up onto toes",
      "Lower below step level",
      "Control the movement"
    ],
    commonMistakes: [
      "Not going full range of motion",
      "Using momentum",
      "Not controlling descent",
      "Bouncing at bottom"
    ],
    safetyTips: "Use controlled movements and hold the stretch at the bottom.",
    videoUrl: "https://www.youtube.com/watch?v=3VcKXH1OBi4",
    idealAngles: {
      ankleAngle: { min: 80, max: 100 },
      kneeAngle: { min: 85, max: 95 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 15,
    name: "Plank",
    targetMuscles: ["Core", "Shoulders"],
    difficulty: "Beginner",
    thumbnail: "🤸‍♂️",
    description: "An isometric core strengthening exercise.",
    tips: [
      "Keep body in straight line",
      "Engage core muscles",
      "Breathe normally",
      "Hold position"
    ],
    commonMistakes: [
      "Sagging hips",
      "Raising hips too high",
      "Holding breath",
      "Looking up"
    ],
    safetyTips: "Start with shorter holds and build up duration gradually.",
    videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    idealAngles: {
      shoulderAngle: { min: 85, max: 95 },
      hipAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 16,
    name: "Mountain Climbers",
    targetMuscles: ["Core", "Shoulders", "Legs"],
    difficulty: "Intermediate",
    thumbnail: "🏃‍♀️",
    description: "A dynamic core and cardio exercise.",
    tips: [
      "Start in plank position",
      "Bring knees to chest alternately",
      "Keep core engaged",
      "Maintain plank position"
    ],
    commonMistakes: [
      "Raising hips too high",
      "Not engaging core",
      "Going too fast",
      "Losing plank position"
    ],
    safetyTips: "Focus on form over speed and maintain proper plank position.",
    videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
    idealAngles: {
      shoulderAngle: { min: 85, max: 95 },
      hipAngle: { min: 85, max: 95 },
      kneeAngle: { min: 70, max: 90 }
    }
  },
  {
    id: 17,
    name: "Burpees",
    targetMuscles: ["Full Body"],
    difficulty: "Advanced",
    thumbnail: "🤸‍♀️",
    description: "A full-body explosive exercise.",
    tips: [
      "Start standing",
      "Drop to push-up position",
      "Perform push-up",
      "Jump feet to hands and jump up"
    ],
    commonMistakes: [
      "Not going full range",
      "Landing hard on feet",
      "Not engaging core",
      "Going too fast"
    ],
    safetyTips: "Start with modified burpees and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      kneeAngle: { min: 80, max: 100 }
    }
  },
  {
    id: 18,
    name: "Russian Twists",
    targetMuscles: ["Obliques", "Core"],
    difficulty: "Beginner",
    thumbnail: "🤸‍♂️",
    description: "A rotational core exercise.",
    tips: [
      "Sit with knees bent",
      "Lean back slightly",
      "Rotate torso side to side",
      "Keep core engaged"
    ],
    commonMistakes: [
      "Using momentum",
      "Not engaging core",
      "Going too fast",
      "Rounding shoulders"
    ],
    safetyTips: "Focus on controlled rotation and proper core engagement.",
    videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    idealAngles: {
      hipAngle: { min: 70, max: 90 },
      shoulderAngle: { min: 80, max: 100 },
      spineAngle: { min: 75, max: 85 }
    }
  },
  {
    id: 19,
    name: "Leg Press",
    targetMuscles: ["Quadriceps", "Glutes"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    description: "A machine-based leg exercise.",
    tips: [
      "Keep feet shoulder-width apart",
      "Lower weight with control",
      "Press through heels",
      "Don't lock knees"
    ],
    commonMistakes: [
      "Going too deep",
      "Knees caving in",
      "Using too much weight",
      "Bouncing at bottom"
    ],
    safetyTips: "Start with lighter weight and focus on proper foot placement.",
    videoUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 20,
    name: "Chest Fly",
    targetMuscles: ["Chest", "Anterior Delts"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "An isolation exercise for chest development.",
    tips: [
      "Start with arms extended",
      "Lower weights in arc motion",
      "Feel stretch in chest",
      "Bring arms together"
    ],
    commonMistakes: [
      "Going too heavy",
      "Not feeling stretch",
      "Using momentum",
      "Overextending shoulders"
    ],
    safetyTips: "Use lighter weights and focus on the stretch and squeeze.",
    videoUrl: "https://www.youtube.com/watch?v=eozdVDA78K0",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 21,
    name: "Hammer Curls",
    targetMuscles: ["Biceps", "Forearms"],
    difficulty: "Beginner",
    thumbnail: "💪",
    description: "A variation of bicep curls with neutral grip.",
    tips: [
      "Hold dumbbells with neutral grip",
      "Keep elbows close to sides",
      "Curl up slowly",
      "Lower with control"
    ],
    commonMistakes: [
      "Swinging the weight",
      "Moving elbows forward",
      "Not controlling descent",
      "Using too much weight"
    ],
    safetyTips: "Focus on controlled movement and proper elbow position.",
    videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 85, max: 95 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 22,
    name: "Lateral Raises",
    targetMuscles: ["Shoulders"],
    difficulty: "Beginner",
    thumbnail: "💪",
    description: "An isolation exercise for shoulder development.",
    tips: [
      "Start with arms at sides",
      "Raise arms to shoulder height",
      "Keep slight bend in elbows",
      "Lower with control"
    ],
    commonMistakes: [
      "Using too much weight",
      "Raising too high",
      "Using momentum",
      "Not controlling descent"
    ],
    safetyTips: "Use lighter weights and focus on proper shoulder mechanics.",
    videoUrl: "https://www.youtube.com/watch?v=3VcKXH1OBi4",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 85, max: 95 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 23,
    name: "Face Pulls",
    targetMuscles: ["Rear Delts", "Rhomboids"],
    difficulty: "Beginner",
    thumbnail: "🏋️‍♀️",
    description: "A pulling exercise for rear deltoids.",
    tips: [
      "Set cable at face height",
      "Pull rope to face",
      "Separate hands at face",
      "Squeeze shoulder blades"
    ],
    commonMistakes: [
      "Using too much weight",
      "Not squeezing shoulder blades",
      "Pulling too low",
      "Using momentum"
    ],
    safetyTips: "Focus on proper shoulder blade retraction and controlled movement.",
    videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 24,
    name: "Leg Curls",
    targetMuscles: ["Hamstrings"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    description: "A machine-based hamstring exercise.",
    tips: [
      "Lie face down on machine",
      "Curl heels to glutes",
      "Squeeze hamstrings",
      "Lower with control"
    ],
    commonMistakes: [
      "Using momentum",
      "Not going full range",
      "Raising hips",
      "Going too fast"
    ],
    safetyTips: "Focus on controlled movement and proper hamstring engagement.",
    videoUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 85, max: 95 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 25,
    name: "Leg Extensions",
    targetMuscles: ["Quadriceps"],
    difficulty: "Beginner",
    thumbnail: "🦵",
    description: "A machine-based quadriceps exercise.",
    tips: [
      "Sit on machine with back flat",
      "Extend legs fully",
      "Squeeze quads at top",
      "Lower with control"
    ],
    commonMistakes: [
      "Using momentum",
      "Not going full range",
      "Leaning back",
      "Going too fast"
    ],
    safetyTips: "Use controlled movement and avoid locking knees forcefully.",
    videoUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 85, max: 95 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 26,
    name: "Cable Rows",
    targetMuscles: ["Lats", "Rhomboids", "Biceps"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♂️",
    description: "A cable-based pulling exercise.",
    tips: [
      "Sit with knees slightly bent",
      "Pull handle to lower chest",
      "Squeeze shoulder blades",
      "Control the return"
    ],
    commonMistakes: [
      "Using momentum",
      "Not squeezing shoulder blades",
      "Pulling too high",
      "Rounding shoulders"
    ],
    safetyTips: "Focus on proper shoulder blade retraction and controlled movement.",
    videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 27,
    name: "Chest Press Machine",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    difficulty: "Beginner",
    thumbnail: "💪",
    description: "A machine-based chest pressing exercise.",
    tips: [
      "Sit with back flat against pad",
      "Press handles forward",
      "Squeeze chest at peak",
      "Control the return"
    ],
    commonMistakes: [
      "Using too much weight",
      "Not controlling return",
      "Arching back excessively",
      "Not going full range"
    ],
    safetyTips: "Start with lighter weight and focus on proper chest engagement.",
    videoUrl: "https://www.youtube.com/watch?v=8iPEnov-lmU",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 28,
    name: "Seated Row",
    targetMuscles: ["Lats", "Rhomboids", "Biceps"],
    difficulty: "Beginner",
    thumbnail: "🏋️‍♀️",
    description: "A seated machine-based rowing exercise.",
    tips: [
      "Sit with chest against pad",
      "Pull handles to chest",
      "Squeeze shoulder blades",
      "Control the return"
    ],
    commonMistakes: [
      "Using momentum",
      "Not squeezing shoulder blades",
      "Pulling too high",
      "Rounding shoulders"
    ],
    safetyTips: "Focus on proper shoulder blade retraction and controlled movement.",
    videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 29,
    name: "Hip Thrusts",
    targetMuscles: ["Glutes", "Hamstrings"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♂️",
    description: "A hip extension exercise for glute development.",
    tips: [
      "Sit with upper back against bench",
      "Drive hips up",
      "Squeeze glutes at top",
      "Lower with control"
    ],
    commonMistakes: [
      "Not going full range",
      "Not squeezing glutes",
      "Using too much weight",
      "Arching back excessively"
    ],
    safetyTips: "Focus on proper hip extension and glute engagement.",
    videoUrl: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
    idealAngles: {
      hipAngle: { min: 80, max: 100 },
      kneeAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 30,
    name: "Bulgarian Split Squats",
    targetMuscles: ["Quadriceps", "Glutes"],
    difficulty: "Advanced",
    thumbnail: "🏃‍♂️",
    description: "A unilateral leg exercise with rear foot elevated.",
    tips: [
      "Place rear foot on bench",
      "Lower into lunge position",
      "Drive up through front leg",
      "Keep torso upright"
    ],
    commonMistakes: [
      "Leaning forward too much",
      "Not going deep enough",
      "Losing balance",
      "Using too much weight"
    ],
    safetyTips: "Start with bodyweight and focus on balance before adding weight.",
    videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
    idealAngles: {
      frontKneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 31,
    name: "Incline Bench Press",
    targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A chest pressing exercise on an inclined bench.",
    tips: [
      "Set bench to 30-45 degrees",
      "Keep shoulder blades retracted",
      "Lower bar to upper chest",
      "Press up in straight line"
    ],
    commonMistakes: [
      "Using too much incline",
      "Bouncing bar off chest",
      "Flaring elbows too wide",
      "Not controlling descent"
    ],
    safetyTips: "Start with lighter weights and focus on proper upper chest engagement.",
    videoUrl: "https://www.youtube.com/watch?v=8iPEnov-lmU",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 32,
    name: "Decline Bench Press",
    targetMuscles: ["Lower Chest", "Shoulders", "Triceps"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A chest pressing exercise on a declined bench.",
    tips: [
      "Set bench to 15-30 degrees decline",
      "Keep feet secured",
      "Lower bar to lower chest",
      "Press up explosively"
    ],
    commonMistakes: [
      "Using too much decline",
      "Not securing feet",
      "Bouncing bar off chest",
      "Going too heavy"
    ],
    safetyTips: "Ensure proper foot security and start with lighter weights.",
    videoUrl: "https://www.youtube.com/watch?v=8iPEnov-lmU",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 33,
    name: "Dumbbell Flyes",
    targetMuscles: ["Chest", "Anterior Delts"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A dumbbell-based chest isolation exercise.",
    tips: [
      "Lie on bench with dumbbells",
      "Start with arms extended",
      "Lower in arc motion",
      "Feel stretch in chest"
    ],
    commonMistakes: [
      "Going too heavy",
      "Not feeling stretch",
      "Using momentum",
      "Overextending shoulders"
    ],
    safetyTips: "Use lighter weights and focus on the stretch and squeeze.",
    videoUrl: "https://www.youtube.com/watch?v=eozdVDA78K0",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 34,
    name: "Preacher Curls",
    targetMuscles: ["Biceps"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "An isolation bicep exercise using a preacher bench.",
    tips: [
      "Sit at preacher bench",
      "Rest arms on pad",
      "Curl weight up slowly",
      "Lower with control"
    ],
    commonMistakes: [
      "Using too much weight",
      "Not controlling descent",
      "Moving elbows off pad",
      "Using momentum"
    ],
    safetyTips: "Focus on controlled movement and proper arm positioning.",
    videoUrl: "https://www.youtube.com/watch?v=fIWP-FRF9UY",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 85, max: 95 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 35,
    name: "Skull Crushers",
    targetMuscles: ["Triceps"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A tricep isolation exercise lying down.",
    tips: [
      "Lie on bench with weights",
      "Lower weights to forehead",
      "Press up using triceps",
      "Keep elbows stable"
    ],
    commonMistakes: [
      "Using too much weight",
      "Moving elbows",
      "Not controlling descent",
      "Going too heavy"
    ],
    safetyTips: "Start with lighter weights and focus on proper elbow positioning.",
    videoUrl: "https://www.youtube.com/watch?v=6kALZikXxLc",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 85, max: 95 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 36,
    name: "Close-Grip Bench Press",
    targetMuscles: ["Triceps", "Chest"],
    difficulty: "Intermediate",
    thumbnail: "💪",
    description: "A bench press variation with narrow grip.",
    tips: [
      "Use narrow grip on bar",
      "Lower to chest",
      "Press up using triceps",
      "Keep elbows close"
    ],
    commonMistakes: [
      "Using too narrow grip",
      "Not controlling descent",
      "Flaring elbows",
      "Going too heavy"
    ],
    safetyTips: "Start with lighter weights and focus on proper tricep engagement.",
    videoUrl: "https://www.youtube.com/watch?v=nEF0qv2rZ4k",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 85, max: 95 },
      wristAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 37,
    name: "Wide-Grip Pull-ups",
    targetMuscles: ["Lats", "Rhomboids"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "A pull-up variation with wide grip.",
    tips: [
      "Use wide grip on bar",
      "Pull chest to bar",
      "Squeeze lats",
      "Lower with control"
    ],
    commonMistakes: [
      "Not going full range",
      "Using momentum",
      "Not engaging lats",
      "Going too wide"
    ],
    safetyTips: "Start with assisted pull-ups and focus on proper lat engagement.",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 38,
    name: "Chin-ups",
    targetMuscles: ["Lats", "Biceps"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♀️",
    description: "A pull-up variation with underhand grip.",
    tips: [
      "Use underhand grip",
      "Pull chest to bar",
      "Squeeze lats and biceps",
      "Lower with control"
    ],
    commonMistakes: [
      "Not going full range",
      "Using momentum",
      "Not engaging lats",
      "Rushing the movement"
    ],
    safetyTips: "Start with assisted chin-ups and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 39,
    name: "Dips",
    targetMuscles: ["Triceps", "Chest"],
    difficulty: "Advanced",
    thumbnail: "💪",
    description: "A bodyweight exercise for triceps and chest.",
    tips: [
      "Support body on bars",
      "Lower until elbows at 90 degrees",
      "Press up using triceps",
      "Keep core engaged"
    ],
    commonMistakes: [
      "Going too deep",
      "Flaring elbows out",
      "Not engaging core",
      "Using legs too much"
    ],
    safetyTips: "Start with assisted dips if needed and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=6kALZikXxLc",
    idealAngles: {
      elbowAngle: { min: 80, max: 100 },
      shoulderAngle: { min: 70, max: 90 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 40,
    name: "Pike Push-ups",
    targetMuscles: ["Shoulders", "Triceps"],
    difficulty: "Advanced",
    thumbnail: "💪",
    description: "A bodyweight shoulder exercise.",
    tips: [
      "Start in downward dog position",
      "Lower head toward hands",
      "Press up using shoulders",
      "Keep core engaged"
    ],
    commonMistakes: [
      "Not going full range",
      "Not engaging core",
      "Using momentum",
      "Going too fast"
    ],
    safetyTips: "Start with modified pike push-ups and focus on proper shoulder mechanics.",
    videoUrl: "https://www.youtube.com/watch?v=5y6hVzU6U0s",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 41,
    name: "Handstand Push-ups",
    targetMuscles: ["Shoulders", "Triceps", "Core"],
    difficulty: "Advanced",
    thumbnail: "🤸‍♂️",
    description: "An advanced bodyweight shoulder exercise.",
    tips: [
      "Start in handstand position",
      "Lower head toward ground",
      "Press up using shoulders",
      "Keep core tight"
    ],
    commonMistakes: [
      "Not going full range",
      "Not engaging core",
      "Using momentum",
      "Losing balance"
    ],
    safetyTips: "Master handstand holds before attempting push-ups.",
    videoUrl: "https://www.youtube.com/watch?v=5y6hVzU6U0s",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      elbowAngle: { min: 70, max: 90 },
      hipAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 42,
    name: "Muscle-ups",
    targetMuscles: ["Lats", "Triceps", "Chest"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "An advanced bodyweight exercise combining pull-up and dip.",
    tips: [
      "Start with explosive pull-up",
      "Transition to dip position",
      "Press up to support",
      "Lower with control"
    ],
    commonMistakes: [
      "Not going full range",
      "Using momentum",
      "Not engaging core",
      "Rushing the movement"
    ],
    safetyTips: "Master pull-ups and dips separately before attempting muscle-ups.",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    idealAngles: {
      shoulderAngle: { min: 70, max: 90 },
      elbowAngle: { min: 80, max: 100 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 43,
    name: "Front Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Core"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♀️",
    description: "A squat variation with bar in front position.",
    tips: [
      "Rest bar on front of shoulders",
      "Keep elbows high",
      "Squat down with control",
      "Drive up through heels"
    ],
    commonMistakes: [
      "Not keeping elbows high",
      "Rounding the back",
      "Not going deep enough",
      "Using too much weight"
    ],
    safetyTips: "Start with lighter weights and focus on proper bar positioning.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 44,
    name: "Overhead Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Shoulders", "Core"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "A squat variation with bar overhead.",
    tips: [
      "Hold bar overhead",
      "Keep arms locked",
      "Squat down with control",
      "Maintain overhead position"
    ],
    commonMistakes: [
      "Not keeping arms locked",
      "Losing overhead position",
      "Not going deep enough",
      "Using too much weight"
    ],
    safetyTips: "Start with lighter weights and focus on proper overhead positioning.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      shoulderAngle: { min: 80, max: 100 }
    }
  },
  {
    id: 45,
    name: "Goblet Squats",
    targetMuscles: ["Quadriceps", "Glutes"],
    difficulty: "Beginner",
    thumbnail: "🏋️‍♀️",
    description: "A squat variation holding a dumbbell or kettlebell.",
    tips: [
      "Hold weight at chest level",
      "Keep chest up",
      "Squat down with control",
      "Drive up through heels"
    ],
    commonMistakes: [
      "Not keeping chest up",
      "Rounding the back",
      "Not going deep enough",
      "Using too much weight"
    ],
    safetyTips: "Start with lighter weights and focus on proper squat mechanics.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 46,
    name: "Sumo Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Inner Thighs"],
    difficulty: "Beginner",
    thumbnail: "🏋️‍♂️",
    description: "A squat variation with wide stance.",
    tips: [
      "Stand with wide stance",
      "Point toes slightly out",
      "Squat down with control",
      "Drive up through heels"
    ],
    commonMistakes: [
      "Not going wide enough",
      "Rounding the back",
      "Not going deep enough",
      "Knees caving in"
    ],
    safetyTips: "Focus on proper stance width and knee tracking.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 47,
    name: "Jump Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    difficulty: "Intermediate",
    thumbnail: "🏃‍♂️",
    description: "An explosive squat variation with jumping.",
    tips: [
      "Start in squat position",
      "Jump up explosively",
      "Land softly",
      "Immediately go into next squat"
    ],
    commonMistakes: [
      "Landing hard",
      "Not going full range",
      "Using momentum",
      "Not engaging core"
    ],
    safetyTips: "Focus on soft landings and proper squat mechanics.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 48,
    name: "Pistol Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Core"],
    difficulty: "Advanced",
    thumbnail: "🏃‍♀️",
    description: "A single-leg squat variation.",
    tips: [
      "Stand on one leg",
      "Extend other leg forward",
      "Squat down on one leg",
      "Stand up using one leg"
    ],
    commonMistakes: [
      "Not going full range",
      "Losing balance",
      "Not engaging core",
      "Using momentum"
    ],
    safetyTips: "Start with assisted pistol squats and focus on balance.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 49,
    name: "Wall Sits",
    targetMuscles: ["Quadriceps", "Glutes"],
    difficulty: "Beginner",
    thumbnail: "🤸‍♂️",
    description: "An isometric leg exercise against a wall.",
    tips: [
      "Sit against wall",
      "Keep thighs parallel to floor",
      "Hold position",
      "Breathe normally"
    ],
    commonMistakes: [
      "Not going low enough",
      "Not engaging core",
      "Holding breath",
      "Losing position"
    ],
    safetyTips: "Start with shorter holds and build up duration gradually.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 50,
    name: "Step-ups",
    targetMuscles: ["Quadriceps", "Glutes"],
    difficulty: "Beginner",
    thumbnail: "🏃‍♂️",
    description: "A unilateral leg exercise using a step or box.",
    tips: [
      "Step up onto box",
      "Drive through heel",
      "Stand up fully",
      "Step down with control"
    ],
    commonMistakes: [
      "Not going full range",
      "Using momentum",
      "Not engaging core",
      "Going too fast"
    ],
    safetyTips: "Start with lower height and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 51,
    name: "Box Jumps",
    targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    difficulty: "Intermediate",
    thumbnail: "🏃‍♀️",
    description: "An explosive jumping exercise onto a box.",
    tips: [
      "Stand in front of box",
      "Jump onto box",
      "Land softly",
      "Step down with control"
    ],
    commonMistakes: [
      "Landing hard",
      "Not going full range",
      "Using momentum",
      "Not engaging core"
    ],
    safetyTips: "Start with lower height and focus on soft landings.",
    videoUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
    idealAngles: {
      kneeAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      ankleAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 52,
    name: "Single-Leg Deadlifts",
    targetMuscles: ["Hamstrings", "Glutes", "Core"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "A unilateral deadlift variation.",
    tips: [
      "Stand on one leg",
      "Hinge at hip",
      "Extend other leg back",
      "Return to standing"
    ],
    commonMistakes: [
      "Not engaging core",
      "Losing balance",
      "Rounding the back",
      "Using momentum"
    ],
    safetyTips: "Start with bodyweight and focus on balance before adding weight.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      kneeAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 53,
    name: "Good Mornings",
    targetMuscles: ["Hamstrings", "Glutes", "Lower Back"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♀️",
    description: "A hip hinge movement with bar on shoulders.",
    tips: [
      "Stand with bar on shoulders",
      "Hinge at hips",
      "Feel stretch in hamstrings",
      "Return to standing"
    ],
    commonMistakes: [
      "Rounding the back",
      "Not engaging core",
      "Going too heavy",
      "Not feeling hamstring stretch"
    ],
    safetyTips: "Start with lighter weights and focus on proper hip hinge.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      kneeAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 54,
    name: "Stiff-Leg Deadlifts",
    targetMuscles: ["Hamstrings", "Glutes"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♂️",
    description: "A deadlift variation with straighter legs.",
    tips: [
      "Keep legs relatively straight",
      "Hinge at hips",
      "Feel stretch in hamstrings",
      "Return to standing"
    ],
    commonMistakes: [
      "Rounding the back",
      "Not feeling hamstring stretch",
      "Going too heavy",
      "Not engaging core"
    ],
    safetyTips: "Start with lighter weights and focus on hamstring stretch.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      kneeAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 55,
    name: "Kettlebell Swings",
    targetMuscles: ["Hamstrings", "Glutes", "Core"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♀️",
    description: "A dynamic hip hinge movement with kettlebell.",
    tips: [
      "Stand with feet shoulder-width apart",
      "Hinge at hips",
      "Swing kettlebell up",
      "Use hip drive"
    ],
    commonMistakes: [
      "Using arms too much",
      "Not engaging core",
      "Not using hip drive",
      "Going too heavy"
    ],
    safetyTips: "Start with lighter weight and focus on proper hip hinge.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      hipAngle: { min: 60, max: 80 },
      kneeAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 56,
    name: "Turkish Get-ups",
    targetMuscles: ["Full Body"],
    difficulty: "Advanced",
    thumbnail: "🏋️‍♂️",
    description: "A complex full-body movement with kettlebell.",
    tips: [
      "Start lying down",
      "Hold kettlebell overhead",
      "Stand up in stages",
      "Reverse the movement"
    ],
    commonMistakes: [
      "Not keeping kettlebell overhead",
      "Rushing the movement",
      "Not engaging core",
      "Going too heavy"
    ],
    safetyTips: "Start with lighter weight and focus on proper movement pattern.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 57,
    name: "Farmer's Walk",
    targetMuscles: ["Grip", "Core", "Traps"],
    difficulty: "Intermediate",
    thumbnail: "🏋️‍♀️",
    description: "A loaded carry exercise.",
    tips: [
      "Pick up heavy weights",
      "Walk with good posture",
      "Keep core engaged",
      "Maintain grip"
    ],
    commonMistakes: [
      "Not engaging core",
      "Rounding shoulders",
      "Going too heavy",
      "Not maintaining posture"
    ],
    safetyTips: "Start with lighter weights and focus on proper posture.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      shoulderAngle: { min: 85, max: 95 },
      hipAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 58,
    name: "Battle Ropes",
    targetMuscles: ["Core", "Shoulders", "Arms"],
    difficulty: "Intermediate",
    thumbnail: "🏃‍♂️",
    description: "A dynamic rope exercise for conditioning.",
    tips: [
      "Hold rope ends",
      "Create waves in rope",
      "Keep core engaged",
      "Use full body"
    ],
    commonMistakes: [
      "Not engaging core",
      "Using only arms",
      "Going too fast",
      "Not maintaining rhythm"
    ],
    safetyTips: "Start with shorter intervals and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      hipAngle: { min: 85, max: 95 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 59,
    name: "Sled Pushes",
    targetMuscles: ["Legs", "Core", "Cardio"],
    difficulty: "Intermediate",
    thumbnail: "🏃‍♀️",
    description: "A pushing exercise with weighted sled.",
    tips: [
      "Push sled with hands",
      "Keep core engaged",
      "Use leg drive",
      "Maintain posture"
    ],
    commonMistakes: [
      "Not engaging core",
      "Using only arms",
      "Not maintaining posture",
      "Going too heavy"
    ],
    safetyTips: "Start with lighter weight and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      spineAngle: { min: 85, max: 95 }
    }
  },
  {
    id: 60,
    name: "Sled Pulls",
    targetMuscles: ["Legs", "Core", "Cardio"],
    difficulty: "Intermediate",
    thumbnail: "🏃‍♂️",
    description: "A pulling exercise with weighted sled.",
    tips: [
      "Pull sled with rope",
      "Keep core engaged",
      "Use leg drive",
      "Maintain posture"
    ],
    commonMistakes: [
      "Not engaging core",
      "Using only arms",
      "Not maintaining posture",
      "Going too heavy"
    ],
    safetyTips: "Start with lighter weight and focus on proper form.",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    idealAngles: {
      shoulderAngle: { min: 80, max: 100 },
      hipAngle: { min: 70, max: 90 },
      spineAngle: { min: 85, max: 95 }
    }
  }
];


