// utils/exerciseRecommender.js

const moodToExercises = {
  happy: [
    { name: 'Dancing', benefits: 'Boosts mood and cardiovascular health' },
    { name: 'Jogging', benefits: 'Improves endurance and burns calories' },
    { name: 'Cycling outdoors', benefits: 'Enhances leg strength and mental well-being' },
  ],
  sad: [
    { name: 'Gentle yoga', benefits: 'Reduces sadness and improves flexibility' },
    { name: 'Walking in nature', benefits: 'Lowers cortisol and elevates mood' },
    { name: 'Stretching', benefits: 'Relieves tension and improves circulation' },
  ],
  anxious: [
    { name: 'Deep breathing exercises', benefits: 'Calms the nervous system and reduces anxiety' },
    { name: 'Tai Chi', benefits: 'Promotes balance and mental clarity' },
    { name: 'Grounding meditation', benefits: 'Increases presence and reduces anxious thoughts' },
  ],
  angry: [
    { name: 'Boxing workout', benefits: 'Channels anger and builds strength' },
    { name: 'HIIT', benefits: 'Burns energy and relieves aggression' },
    { name: 'Heavy weightlifting', benefits: 'Improves focus and releases frustration' },
  ],
  neutral: [
    { name: 'Light cardio', benefits: 'Maintains energy levels and supports heart health' },
    { name: 'Swimming', benefits: 'Low-impact and full-body conditioning' },
    { name: 'Core strengthening', benefits: 'Improves posture and stability' },
  ],
  excited: [
    { name: 'High-energy aerobics', benefits: 'Burns calories quickly and lifts mood' },
    { name: 'Running', benefits: 'Improves stamina and reduces stress' },
    { name: 'Dance fitness', benefits: 'Fun way to stay fit and increase coordination' },
  ],
  calm: [
    { name: 'Yoga nidra', benefits: 'Deep relaxation and nervous system reset' },
    { name: 'Stretching', benefits: 'Releases muscle tightness and encourages mindfulness' },
    { name: 'Slow walks', benefits: 'Gentle movement for reflection and recovery' },
  ],
  fearful: [
    { name: 'Breathing exercises', benefits: 'Reduces panic and increases control' },
    { name: 'Guided meditation', benefits: 'Supports emotional regulation and safety' },
    { name: 'Light stretching', benefits: 'Soothes the body and reduces muscle tension' },
  ],
  frustrated: [
    { name: 'Punching bag workout', benefits: 'Releases pent-up energy and tension' },
    { name: 'Sprints', benefits: 'Quick energy release and endorphin boost' },
    { name: 'Resistance band training', benefits: 'Strengthens muscles and improves focus' },
  ],
};

async function getExercisesForMood(mood) {
  const defaultExercises = [
    { name: 'Stretching', benefits: 'Improves flexibility and relieves tension' },
    { name: 'Walking', benefits: 'Boosts circulation and mental clarity' },
    { name: 'Breathing exercises', benefits: 'Reduces anxiety and calms the mind' },
  ];
  return moodToExercises[mood] || defaultExercises;
}

module.exports = getExercisesForMood;

