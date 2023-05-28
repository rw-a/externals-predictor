import Button from 'react-bootstrap/Button';
import { Subjects, SubjectCode } from '../types';
import { getPercentile, getExternalScore } from '../utility/data';

const ATAR_CALCULATOR_LOCAL_STORAGE_NAME = "atarCalculatorSubjects";

interface ExportButtonProps {
    subjects: Subjects,
    year: number,
}

export default function ExportButton({subjects, year}: ExportButtonProps) {
    function handleExport() {
        const subjectCodes = Object.keys(subjects) as SubjectCode[];
        const subjectPercentiles = {};
        const subjectExternalScores = {};
        const subjectTotalScores = {};
        
        for (const subjectCode of subjectCodes) {
            const percentile = getPercentile(year, subjectCode, subjects[subjectCode]);
            subjectPercentiles[subjectCode] = percentile;
    
            subjectExternalScores[subjectCode] = getExternalScore(year, subjectCode, percentile);

            subjectTotalScores[subjectCode] = subjects[subjectCode] + subjectExternalScores[subjectCode].number;
        }

        localStorage.setItem(ATAR_CALCULATOR_LOCAL_STORAGE_NAME, JSON.stringify(subjectTotalScores));
        window.location.href = '/atar-calculator';
    }

    return (
        <Button variant="primary" onClick={handleExport}>Now calculate my ATAR!</Button>
    );
}