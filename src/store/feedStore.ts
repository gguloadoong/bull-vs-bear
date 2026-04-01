import { atomWithStorage } from 'jotai/utils'

export type FeedVotes = Record<string, 'bull' | 'bear'>  // key: `${topicId}_${date}`

export const feedVotesAtom = atomWithStorage<FeedVotes>('bvb_feed_votes', {})

export function getFeedVoteKey(topicId: string, date: string): string {
  return `${topicId}_${date}`
}
