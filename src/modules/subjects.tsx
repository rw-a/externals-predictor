import './../css/subjects.css';
import React from 'react';
import Select, { StylesConfig } from 'react-select';

import { Subjects, SubjectCode, Score, 
	OnScoreChange, OnSubjectDelete, OnSubjectAdd, OnClick, OnSubjectsSave } from '../types';
import { getSubjects, isMathScienceSubject } from '../utility/data';
import SUBJECTS from '../data/all_subjects.json';

import saveButtonImg from './../assets/save.svg';
import saveButtonImgFilled from './../assets/save_filled.svg';



interface SubjectRawScoreProps {
	score: Score,
	code: SubjectCode,
	onScoreChange: ((score: Score) => void);
}
  
function SubjectRawScore({score, code, onScoreChange}: SubjectRawScoreProps) {
	const maxScore = isMathScienceSubject(code) ? 50 : 75;

	function handleScoreChange(event: React.FormEvent<HTMLInputElement> & {target: HTMLInputElement}) {
		if (!event.target) return;

		if (event.target.value) {
			// only allow integer values between 0 and 100
			let score = Math.round(Number(event.target.value));
			if (score > maxScore) {
				return;
			} else if (score < 0) {
				score = Math.abs(score);
			}
			onScoreChange(score);
		} else {
			onScoreChange("");  // allow blank values 
		}
	}
	
	return (
		<input 
			type="number" 
			min="0" 
			max={String(maxScore)}
			title={`${SUBJECTS[code]} Internals Score`}
			value={score} 
			onChange={handleScoreChange}>
		</input>
	);
}


interface SubjectRowProps {
	code: SubjectCode,
	year: number,
	score: Score,
	onScoreChange: OnScoreChange,
	onSubjectDelete: OnSubjectDelete,
}

function SubjectRow({code, score, onScoreChange, onSubjectDelete}: SubjectRowProps) {
	function handleScoreChange(score: Score) {
		onScoreChange(score, code);
	}

	function handleSubjectDelete() {
		onSubjectDelete(code);
	}

	return (
		<li className="SubjectRow">
			<span className="DeleteSubject" onClick={handleSubjectDelete}></span>
			<span className="me-auto">
				{SUBJECTS[code]}
			</span>
			<SubjectRawScore code={code} score={score} onScoreChange={handleScoreChange} />
		</li>
	);
}

interface SubjectSelectorProps {
	subjects: Subjects,
	year: number,
	onSubjectAdd: OnSubjectAdd,
}

function SubjectSelector({subjects, year, onSubjectAdd}: SubjectSelectorProps) {
	const filterOptions = (candidate: {value: string, label: string}, input: string) => {
		// remove an option if it has already been added
		if (Object.keys(subjects).includes(candidate.value)) {
			return false;
		}

		// normal filter stuff
		if (input) {
			return candidate.label.toLowerCase().includes(input.toLowerCase());
		} else {
			// if no input, allow everything
			return true;
		}
	}

	const options = [];
	for (const subjectCode of Object.keys(getSubjects(year))) {
		options.push({value: subjectCode, label: SUBJECTS[subjectCode as SubjectCode]});
	}

	const customStyles: StylesConfig = {
		control: (provided: object/*, state: unknown*/) => ({
			...provided,
			// background: '#fff',
			minHeight: '2.3rem',
			height: '2.3rem',
			alignContent: 'center',
		}),
		valueContainer: (provided: object/*, state: unknown*/) => ({
			...provided,
			height: '2.3rem',
			display: 'flex',
			flexDirection: 'row-reverse',
			justifyContent: 'flex-end',
			alignContent: 'center',
			padding: '0rem 0.5rem'
		}),
		input: (provided: object/*, state: unknown*/) => ({
			...provided,
			width: '1px',
		}),
		placeholder: (provided: object/*, state: unknown*/) => ({
			...provided,
			fontSize: '1rem',
			marginLeft: '0px',
		}),
		/* indicatorSeparator: (provided, state) => ({
			...provided,
			display: 'none',
		}), */
		indicatorsContainer: (provided: object/*, state: unknown*/) => ({
			...provided,
			height: '2.2rem',
		}),
		option: (provided: object/*, state: unknown*/) => ({
			...provided,
			padding: '0.35rem 0.75rem',
		}),
	};

	return (
		<Select 
			className='subject-selector'
			classNamePrefix='subject-selector'
			options={options} 
			onChange={onSubjectAdd}
			filterOption={filterOptions}
			placeholder="Add a subject..."
			value={null}
			styles={customStyles}
		/>
	);
}


interface SaveButtonProps {
	saved: boolean,
	onClick: OnClick,
	className: string,
}

function SaveButton({saved, onClick, className}: SaveButtonProps) {
	const imgSrc = (saved) ? saveButtonImgFilled : saveButtonImg;
	return (
		<img src={imgSrc} id="save_img" title={(saved) ? "Subjects Saved!" : "Save Subjects"} 
			alt="Save Subjects" onClick={onClick} 
			className={className}></img>
	);
}


interface SubjectsTableProps {
	subjects: Subjects,
	year: number,
	saved: boolean,
	className: string,
	onScoreChange: OnScoreChange,
	onSubjectAdd: OnSubjectAdd,
	onSubjectDelete: OnSubjectDelete,
	onSubjectsSave: OnSubjectsSave,
}

export default function SubjectsTable({
		subjects, year, saved, className, 
		onScoreChange, onSubjectAdd, onSubjectsSave, onSubjectDelete
		}: SubjectsTableProps) {
	// generate a row for each subject
	const rows = [];
	for (const subjectCode of Object.keys(subjects)) {
		rows.push(
			<SubjectRow 
				key={subjectCode} 
				code={subjectCode as SubjectCode} 
				score={subjects[subjectCode as SubjectCode]} 
				onScoreChange={onScoreChange} 
				onSubjectDelete={onSubjectDelete}
				year={year}
			/>
		);
	}

	return (
		<div className={className}>
			<SaveButton onClick={onSubjectsSave} saved={saved} className="float-end"/>
			<h4>Subjects</h4>
			<ul className="mb-1">
				{rows}
				<li key="0">
					<SubjectSelector 
						onSubjectAdd={onSubjectAdd} 
						subjects={subjects}
						year={year}
					/>
				</li>
			</ul>
		</div>
	);
}