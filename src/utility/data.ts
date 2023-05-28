import SUBJECTS_2021 from './../data/2021_subjects.json';
import SUBJECTS_2022 from './../data/2022_subjects.json';

import INTERALS_DATA from './../data/internals.json';
import EXTERNALS_DATA from './../data/externals.json';

import MATH_SCIENCE_SUBJECTS from '../data/math_science_subjects.json';

import { ExternalScore, Percentile, Score, SubjectCode, Year } from '../types';


export function isMathScienceSubject(SubjectCode: SubjectCode) {
    return Object.hasOwn(MATH_SCIENCE_SUBJECTS, SubjectCode);
}


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


export function getPercentile(year: number, subject: SubjectCode, internalScore: Score): Percentile {
    const percentile = {number: 0, isMax: false, isEmpty: false};   // percentile is a decimal value 0-1 not 0-100
    if (internalScore === "") {
        percentile.isEmpty = true;
    } else if (internalScore === 0) {
        // pass
    } else {
        const subjectData = INTERALS_DATA[String(year) as Year][subject];
        percentile.number = subjectData[internalScore - 1];
        if (internalScore + 1 >= Object.keys(subjectData).length) {     // if the internals score is the highest you can have for the subject
            percentile.isMax = true;
        }
    }
    return percentile;
}

export function getExternalScore(year: number, subject: SubjectCode, percentile: Percentile): ExternalScore {
    const externalScore = {number: 0, isMax: false, isEmpty: false};

    if (percentile.isEmpty) {
        externalScore.isEmpty = true;
        return externalScore;
    }

    const data = EXTERNALS_DATA[String(year) as Year][subject];

    for (const score of Object.keys(data)) {
        if (percentile.number > data[score]) {
            externalScore.number = Number(score);
        }
    }

    // If the internal score was the max, return a range instead
    if (percentile.isMax) {
        externalScore.isMax = true;
        return externalScore;
    }

    return externalScore;
}
