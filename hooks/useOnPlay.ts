import { usePlayer } from './usePlayer';
import { useAuthModal } from './useAuthModal';
import { useUser } from './useUser';
import { useSubscribeModal } from './useSubscribeModal';
import {Song} from "../types/types";

export const useOnPlay = (songs: Song[]) => {
  const subscribeModal = useSubscribeModal();
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user, subscription } = useUser();

  const usePlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };
  return usePlay;
};
