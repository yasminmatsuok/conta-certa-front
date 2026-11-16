import type { LearningTrack } from '../types/learning'
import { api } from './api'

/** GET /learning/tracks — trilhas com as lições e o progresso da pessoa */
export function listTracks(signal?: AbortSignal): Promise<LearningTrack[]> {
  return api.get<LearningTrack[]>('/learning/tracks', signal)
}

/**
 * POST /learning/tracks/{trackId}/lessons/{lessonId}/complete
 * Marca a lição como concluída; devolve a trilha atualizada.
 */
export function completeLesson(trackId: number, lessonId: number): Promise<LearningTrack> {
  return api.post<LearningTrack>(`/learning/tracks/${trackId}/lessons/${lessonId}/complete`)
}
