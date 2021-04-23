import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Episode from '../../pages/episodes/[slug]';


export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [progress, setProgress ] = useState(0)
  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePlayer()



  useEffect(() => {
    if(!audioRef.current){
      return
    }

    if(isPlaying){
      audioRef.current.play()
    }
    else {
      audioRef.current.pause()
    }

  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext){
      playNext();
    }
    else{
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/assets/images/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>


      { episode ? (
        <div className={styles.currentEpisode}>
        <Image 
          width={592}
          height={592}
          src={episode.thumbnail}
          objectFit='cover'
        />
        <strong>{episode.title}</strong>
        <span>{episode.members}</span>
      </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress ?? 0)}</span>
          <div className={styles.slider}>
              { episode ?  (
                <Slider 
                  max = { episode?.file.duration }
                  value={progress}
                  onChange={handleSeek}
                  trackStyle= {{ backgroundColor: '#04d361'}}
                  railStyle= {{ backgroundColor: '#9f75ff'}}
                  handleStyle= {{ borderColor: '#04d361', borderWidth: 4}}
                />
              ) : (
                <div className={styles.emptySlider}></div>
              )}
          </div>
          <span>{convertDurationToTimeString(episode?.file.duration ?? 0)}</span>
        </div>
                
        { episode && (
          <audio 
            src={episode.file.url} 
            ref={audioRef}
            autoPlay
            onEnded={handleEpisodeEnded}
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}
        <div className={styles.buttons}>
          <button type="button" className={ isShuffling ? styles.isActive: ''} onClick={toggleShuffle} disabled={!episode || episodeList.length === 1}>
            <img src="/assets/images/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode  || !hasPrevious} onClick={playPrevious}>
            <img src="/assets/images/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} onClick={togglePlay} disabled={!episode}>
            { isPlaying ? (
              <img src="/assets/images/pause.svg" alt="Tocar"/>
            ) : (
              <img src="/assets/images/play.svg" alt="Tocar"/>
            )}
          </button>
          <button type="button" disabled={!episode ||  !hasNext} onClick={playNext}>
            <img src="/assets/images/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button type="button" className={ isLooping ? styles.isActive: ''} onClick={toggleLoop} disabled={!episode}>
            <img src="/assets/images/repeat.svg" alt="Repetir"/>
          </button>


        </div>
      </footer>
    </div>

  )
}