
export enum AppState {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  CELEBRATION = 'CELEBRATION'
}

export interface FestiveMessage {
  quote: string;
  author: string;
}
