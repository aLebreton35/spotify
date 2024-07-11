'use client';

import { PlayerContent } from './PlayerContent';
import {usePlayer} from "../hooks/usePlayer";
import {useGetSongById} from "../hooks/useGetSongById";
import {useLoadSongUrl} from "../hooks/useLoadSongUrl";

export const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  //* Don't load player if you don't have the song, url, or id
  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
      <div
          className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        h-[80px]
        px-4
        "
      >
        {/* //! Using the `key` attribute on this component to destroy it and re-load to the new songUrl */}
        <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
      </div>
  );
};
