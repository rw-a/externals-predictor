import './../css/results.css';

import Table from 'react-bootstrap/Table';

import { SubjectCode, Subjects, Score } from '../types';
import SUBJECTS from '../data/all_subjects.json';
import { getExternalScore, getPercentile } from '../utility/data';



interface ResultsRowProps {
	code: SubjectCode | "",			// union allows for placeholder row
	rawScore: Score | "‎",
	percentile: Score,
	externalsScore: Score,
}

function ResultsRow({code, rawScore, percentile, externalsScore}: ResultsRowProps) {
	const subjectName = (code === "") ? "" : SUBJECTS[code];
	const percentileDisplay = (percentile === "") ? "" : percentile.toFixed(2);
	const externalsScoreDisplay = (externalsScore === "") ? "" : externalsScore.toFixed(2);

	return(
		<tr>
			<td>{subjectName}</td>
			<td className='text-center'>{rawScore}</td>
			<td className='text-center'>{percentileDisplay}</td>
			<td className='text-center'>{externalsScoreDisplay}</td>
		</tr>
	);
}


interface ResultsTableProps {
	year: number,
	subjects: Subjects,
	className: string,
}
  
export default function ResultsTable({year, subjects, className}: ResultsTableProps) {
	const subjectCodes = Object.keys(subjects) as SubjectCode[];
	const subjectPercentiles = {};
	const subjectExternalScores = {};
	
	for (const subjectCode of subjectCodes) {
		const percentile = getPercentile(year, subjectCode, subjects[subjectCode]);
		subjectPercentiles[subjectCode] = percentile;

		subjectExternalScores[subjectCode] = getExternalScore(year, subjectCode, percentile);
	}

	// sort the subjects
	subjectCodes.sort((a, b) => {
		// by predicted external score
		return (subjectExternalScores[b] - subjectExternalScores[a]);
	});

	// generate the rows of the table
	const rows = [];
	for (const subjectCode of subjectCodes) {
		const rawScore = subjects[subjectCode];
		let percentile: Score;
		let externalsScore: Score;

		if (rawScore === "") {
			percentile = "";
			externalsScore = "";
		} else {
			percentile = subjectPercentiles[subjectCode];
			externalsScore = subjectExternalScores[subjectCode];
		}

		rows.push(
			<ResultsRow 
				key={subjectCode} 
				code={subjectCode} 
				rawScore={rawScore} 
				percentile={percentile}
				externalsScore={externalsScore}
			/>
		);
	}

	// if no subjects added, add blank boxes as placeholders
	if (rows.length < 1) {
		rows.push(
			<ResultsRow key="0" code={""} rawScore={"‎"} percentile={""} externalsScore={""}/>
		);
	}

	return (
		<div className={className}>
			<h4>Results</h4>
			<Table bordered size="sm" className="border-dark">
				<thead>
					<tr className='text-center'>
						<th>Subject</th>
						<th>Raw Score</th>
						<th>Percentile</th>
						<th>External Score</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>
		</div>
	);
}