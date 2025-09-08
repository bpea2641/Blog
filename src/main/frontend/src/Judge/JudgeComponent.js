import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JudgeComponent.css';

function JudgeComponent() {
    const [problemId, setProblemId] = useState(1);
    const [problem, setProblem] = useState(null);
    const [problemError, setProblemError] = useState(null);

    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProblem = () => {
        if (!problemId) return;
        setProblem(null);
        setProblemError(null);
        axios.get(`/problems/${problemId}`)
            .then(response => {
                setProblem(response.data);
            })
            .catch(error => {
                setProblemError(`Problem with ID ${problemId} not found.`);
                console.error('Error fetching problem:', error);
            });
    };

    useEffect(() => {
        fetchProblem();
    }, []);

    const handleSubmit = () => {
        if (!problem) {
            alert("Please load a problem first.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        axios.post('/judge', { problemId: problem.id, code })
            .then(response => {
                setResult(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error during judging:', error);
                let errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
                setResult({ result: 'CLIENT_ERROR', aiFeedback: `Failed to get response: ${errorMsg}` });
                setIsLoading(false);
            });
    };

    return (
        <div className="judge-container">
            <div className="problem-loader">
                <label htmlFor="problemId">문제 번호: </label>
                <input
                    type="number"
                    id="problemId"
                    value={problemId}
                    onChange={e => setProblemId(parseInt(e.target.value, 10) || '')}
                />
                <button onClick={fetchProblem}>불러오기</button>
            </div>

            <div className="judge-layout">
                {/* Left Column: Problem Description */}
                <div className="problem-description">
                    {problemError && <div style={{ color: 'red', marginBottom: '10px' }}>{problemError}</div>}
                    {problem ? (
                        <div>
                            <h2>{problem.title}</h2>
                            <p>{problem.content}</p>
                        </div>
                    ) : (
                        !problemError && <div>Loading problem...</div>
                    )}
                </div>

                {/* Right Column: Code Editor and Results */}
                <div>
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="Enter your Java code here. The class name must be 'Main'."
                        className="code-editor"
                    />
                    <button onClick={handleSubmit} disabled={isLoading || !problem} className="submit-button">
                        {isLoading ? 'Judging...' : 'Submit'}
                    </button>

                    {result && (
                        <div className="result-container">
                            <h3>결과</h3>
                            <p><strong>상태:</strong> <span className={`result-status-${result.result}`}>{result.result}</span></p>
                            {result.aiFeedback && (
                                <div>
                                    <strong>AI Feedback:</strong>
                                    <pre className="ai-feedback">
                                        {result.aiFeedback}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JudgeComponent;