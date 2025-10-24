export type RootStackParamList = {
  Home: undefined;
  Lobby: { username: string };
  Game: { roomId: string; username: string };
};
