import './App.css';
import {useEffect, useState} from 'react';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import { SubjectCode, Subjects, Score } from './types';
import { getSubjects } from './utility/data';
import SubjectsTable from './modules/subjects';
import ResultsTable from './modules/results';


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
	
	const storedSubjects = localStorage.getItem("subjects");
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
		localStorage.setItem("subjects", JSON.stringify(savedSubjects));
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
			<h2>ATAR Calculator QLD/QCE</h2>
			<div className="d-flex flex-column flex-md-row justify-content-between my-2">
				<p className='text-small fst-italic me-1 mb-2 mb-md-1'>
					ATAR Calculator and Subject Scaling Grapher for Queensland (QCE system). 
					Neither QTAC nor QCAA endorse or are affiliated with this website. 
					Scaling changes every year, so use at your own risk! 
					If you would like to contribute to this calculator, 
					please visit <a href="https://forms.gle/Hwat7MJtwU35q1Gj8">here.</a>
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
		</div>
	);
}