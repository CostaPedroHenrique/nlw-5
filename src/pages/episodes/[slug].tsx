import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

import { api } from '../../services/fakeApi'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from './episode.module.scss'
import { EpisodeType } from '../../utils/episodeTypes'
import { usePlayer } from '../../contexts/PlayerContext'

import episodesData from '../../../server.json'

type EpisodeProps = {
  episode: EpisodeType
}
export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()

  return (
    <div className={styles.episode}>
      <Head>
        <title> {episode.title} | RapaduraCastr </title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/assets/images/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
          alt={episode.title}
        />

        <button type="button" onClick={() => play(episode)}>
          <img src="/assets/images/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.published_at}</span>
        <span>{episode.file.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })
  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params

  // const { data } = await api.get(`/episodes/${slug}`)
  const data = episodesData['episodes'].find(episode => episode.id === slug)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    published_at: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    description: data.description,
    file: {
      url: data.file.url,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration))
    }
  }
  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24
  }
}
