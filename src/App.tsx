import './App.css';
import {useEffect, useState} from 'react';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import { SubjectCode, Subjects, Score } from './types';
import { getSubjects } from './utility/data';
import SubjectsTable from './modules/subjects';
import ResultsTable from './modules/results';
import ExportButton from './modules/export'

const LOCAL_STORAGE_NAME = "externalsPredictorSubjects";

function YearSelector({onYearSelect}: {onYearSelect: (selectedYear: number) => void}) {
	return (
			<ToggleButtonGroup type="radio" name="year" defaultValue={2022} onChange={onYearSelect}>
				<ToggleButton variant="outline-primary" className="mb-auto button-small" 
					id="year-2021" key={2021} value={2021}>2021</ToggleButton>
				<ToggleButton variant="outline-primary" className="mb-auto button-small" 
					id="year-2022" key={2022} value={2022}>2022</ToggleButton>
			</ToggleButtonGroup>
		);
}


export default function Calculator() {
	const [year, setYear] = useState(2022);
	
	const storedSubjects = localStorage.getItem(LOCAL_STORAGE_NAME);
	const prevSubjects = (storedSubjects) ? JSON.parse(storedSubjects) : {} as Subjects;
	const [savedSubjects, setSavedSubjects] = useState(prevSubjects);
	const [subjects, setSubjects] = useState(prevSubjects);

	function handleScoreChange(score: Score, subjectCode: SubjectCode) {
		const newSubjects = {...subjects};
		newSubjects[subjectCode] = score;
		setSubjects(newSubjects);
	}

	function handleSubjectAdd(selectedOption: unknown) {
		const option = selectedOption as {value: SubjectCode};
		const newSubjects = {...subjects};
		newSubjects[option.value] = "";
		setSubjects(newSubjects);
	}

	function handleSubjectDelete(subjectCode: SubjectCode) {
		const newSubjects = {...subjects};
		delete newSubjects[subjectCode];
		setSubjects(newSubjects);
	}

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(savedSubjects));
	}, [savedSubjects]);

	function handleSubjectsSave() {
		setSavedSubjects(subjects);
	}

	function handleYearSelect(selectedYear: number) {
		setYear(selectedYear);
	}

	const saved = (JSON.stringify(savedSubjects) === JSON.stringify(subjects));

	const subjectsFiltered = {} as Subjects;
	const subjectsInYear = getSubjects(year);
	for (const subjectCode of Object.keys(subjects)) {
		if (Object.keys(subjectsInYear).includes(subjectCode)) {
			subjectsFiltered[subjectCode as SubjectCode] = subjects[subjectCode];
		}
	}

	return (
		<div id="content">
			<h2>Externals Predictor QLD/QCE</h2>
			<div className="d-flex flex-column flex-md-row justify-content-between my-2">
				<p className='text-small fst-italic me-1 mb-2 mb-md-1'>
					Predicts your external exam marks based on your internal assessment results. 
					Designed for Queensland (QCE system) using 2022 and 2021 data. 
					QCAA neither endorses nor is affiliated with this website. 
					Disclaimer: this assumes that you do as well as the 
					average person with the same internal score!
				</p>
				<YearSelector onYearSelect={handleYearSelect}></YearSelector>
			</div>	
			<SubjectsTable 
				subjects={subjectsFiltered} 
				saved={saved}
				onScoreChange={handleScoreChange}
				onSubjectAdd={handleSubjectAdd}
				onSubjectDelete={handleSubjectDelete}
				onSubjectsSave={handleSubjectsSave}
				year={year}
				className="my-2"
			/>
			<ResultsTable 
				subjects={subjectsFiltered}
				year={year}
				className="my-3"
			/>
			<div className='d-flex justify-content-center'>
				<ExportButton subjects={subjects} year={year}></ExportButton>
			</div>
			<p className='text-small text-center'>
				(Copies your data to the <a href='/atar-calculator'>ATAR Calculator</a>, 
				using the lowest value of any ranges)
			</p>
		</div>
	);
}