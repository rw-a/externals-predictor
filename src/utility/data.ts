import SUBJECTS_2021 from './../data/2021_subjects.json';
import SUBJECTS_2022 from './../data/2022_subjects.json';
import MATH_SCIENCE_SUBJECTS from './../data/math_science_subjects.json';

import INTERALS_DATA from './../data/internals.json';
import EXTERNALS_DATA from './../data/externals.json';

import { Score, SubjectCode, Year } from '../types';


export function getSubjects(year: number) {
    switch (year) {
        case 2021:
            return SUBJECTS_2021;
        case 2022:
            return SUBJECTS_2022;
        default:
            console.error(`Invalid year at getSubjects(). Year=${year}`);
            return {} as never;
    }   
}


export function getPercentile(year: number, subject: SubjectCode, rawScore: Score) {
    return INTERALS_DATA[String(year) as Year][subject][rawScore];
}

export function getExternalScore(year: number, subject: SubjectCode, percentile: number) {
    const data = EXTERNALS_DATA[String(year) as Year][subject];

    const isMathScienceSubject = Object.hasOwn(MATH_SCIENCE_SUBJECTS, subject);
    const maxScore = isMathScienceSubject ? 50 : 25;

    let externalScore = 0;
    for (const score of Object.keys(data)) {
        if (percentile > data[score]) {
            // If nobody got a perfect score, give a range instead of defaulting to max
            if (data[score] > 0.999999 && Number(score) < maxScore) {
                return `≥${score}`;
            }

            externalScore = Number(score);
        }
    }

    return externalScore;
}
