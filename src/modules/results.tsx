import './../css/results.css';

import Table from 'react-bootstrap/Table';

import { SubjectCode, Subjects, Score, Percentile, ExternalScore } from '../types';
import SUBJECTS from '../data/all_subjects.json';
import { getExternalScore, getPercentile } from '../utility/data';



interface ResultsRowProps {
	subjectCode: SubjectCode | "",			// union allows for placeholder row
	internalScore: Score | "‎",
	percentile: Percentile,
	externalsScore: ExternalScore,
}

function ResultsRow({subjectCode, internalScore, percentile, externalsScore}: ResultsRowProps) {
	const subjectName = (subjectCode === "") ? "" : SUBJECTS[subjectCode];
	
	let percentileDisplay;
	if (percentile.isEmpty) {
		percentileDisplay = "";
	} else if (percentile.isMax) {
		percentileDisplay = `≥${(percentile.number * 100).toFixed(2)}`;	// convert decimal to percentage
	} else {
		percentileDisplay = (percentile.number * 100).toFixed(2);
	}

	let externalsScoreDisplay;
	if (externalsScore.isEmpty) {
		externalsScoreDisplay = "";
	} else if (externalsScore.isMax) {
		externalsScoreDisplay = `≥${externalsScore.number.toFixed(2)}`;
	} else {
		externalsScoreDisplay = externalsScore.number.toFixed(2);
	}

	return(
		<tr>
			<td>{subjectName}</td>
			<td className='text-center'>{internalScore}</td>
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
		return (subjectExternalScores[b].number - subjectExternalScores[a].number);
	});

	// generate the rows of the table
	const rows = [];
	for (const subjectCode of subjectCodes) {
		const internalScore = subjects[subjectCode];
		const percentile = subjectPercentiles[subjectCode];
		const externalsScore = subjectExternalScores[subjectCode];

		rows.push(
			<ResultsRow 
				key={subjectCode} 
				subjectCode={subjectCode} 
				internalScore={internalScore} 
				percentile={percentile}
				externalsScore={externalsScore}
			/>
		);
	}

	// if no subjects added, add blank boxes as placeholders
	if (rows.length < 1) {
		rows.push(
			<ResultsRow 
				key="0" subjectCode={""} internalScore={"‎"} 
				percentile={{number: 0, isMax: false, isEmpty: true}} 
				externalsScore={{number: 0, isMax: false, isEmpty: true}}
			/>
		);
	}

	return (
		<div className={className}>
			<h4>Results</h4>
			<Table bordered size="sm" className="border-dark">
				<thead>
					<tr className='text-center'>
						<th>Subject</th>
						<th>Internals Score</th>
						<th>Percentile</th>
						<th>Externals Score</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>
		</div>
	);
}