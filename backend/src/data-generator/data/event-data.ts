export abstract class EventData {

  public static getRandomEventName(skipElements?: string[]): string {
    const randomIndex = Math.floor(Math.random() * this.eventNames.length);
    const result = this.eventNames[randomIndex];
    if (skipElements && skipElements.includes(result)) {
      return this.getRandomEventName(skipElements)
    }
    return result
  }

  private static readonly eventNames = [
    "Sonic Bloom Festival",
    "Eclipse of Sound",
    "Vibes & Vistas",
    "Electric Pulse Showcase",
    "Rhythms of the Night",
    "Harmonic Horizons",
    "Bassline Breakthrough",
    "VibeCraft Music Fest",
    "Neon Echoes",
    "Starlight Soundwaves",
    "Beatwave Carnival",
    "Pulse & Beats Extravaganza",
    "Cosmic Harmony Sessions",
    "Sonic Odyssey",
    "Harmonic Revolution",
    "Frequencies of Freedom",
    "Bassbound",
    "Midnight Melodies",
    "Euphonic Escapade"
  ]
}