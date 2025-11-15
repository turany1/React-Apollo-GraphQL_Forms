import { Response } from '../store/api/types.ts'; 

export const formatAnswer = (questionId: string, responseAnswers: Response['answers']): string => {
    const answer = responseAnswers.find(a => a.questionId === questionId);
    
    if (!answer) {
        return '—';
    }

    if (answer.value) {
        return answer.value.length > 100 ? answer.value.substring(0, 97) + '...' : answer.value;
    }
    if (answer.values && answer.values.length > 0) {
        return answer.values.join(', ');
    }

    return '—';
};