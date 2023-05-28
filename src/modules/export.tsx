import Button from 'react-bootstrap/Button';
import { Subjects } from '../types';

const ATAR_CALCULATOR_LOCAL_STORAGE_NAME = "atarCalculatorSubjects";

interface ExportButtonProps {
    subjects: Subjects
}

export default function ExportButton({subjects}: ExportButtonProps) {
    function handleExport() {
        localStorage.setItem(ATAR_CALCULATOR_LOCAL_STORAGE_NAME, JSON.stringify(subjects));
        window.location.href = '/atar-calculator';
    }

    return (
        <Button variant="primary" onClick={handleExport}>Now calculate my ATAR!</Button>
    );
}