import React, { useState } from 'react';
import axios from 'axios';
import './ProblemAdminComponent.css';

function ProblemAdminComponent() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [testCases, setTestCases] = useState([{ inputValue: '', outputValue: '' }]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleAddTestCase = () => {
        setTestCases([...testCases, { inputValue: '', outputValue: '' }]);
    };

    const handleRemoveTestCase = (index) => {
        const list = [...testCases];
        list.splice(index, 1);
        setTestCases(list);
    };

    const handleTestCaseChange = (e, index, field) => {
        const list = [...testCases];
        list[index][field] = e.target.value;
        setTestCases(list);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const payload = {
            title,
            content,
            testCases,
        };

        axios.post('/problems', payload)
            .then(response => {
                setSuccess(`Problem created successfully with ID: ${response.data.id}`);
                setTitle('');
                setContent('');
                setTestCases([{ inputValue: '', outputValue: '' }]);
            })
            .catch(err => {
                setError(`Error creating problem: ${err.response?.data || err.message}`);
            });
    };

    return (
        <div className="problem-admin-container">
            <h2>문제 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>문제 설명</label>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                </div>

                <h4>입출력</h4>
                {testCases.map((testCase, i) => (
                    <div key={i} className="test-case-container">
                        <textarea
                            placeholder={`Input Value #${i + 1}`}
                            value={testCase.inputValue}
                            onChange={e => handleTestCaseChange(e, i, 'inputValue')}
                            required
                            className="test-case-textarea"
                        />
                        <textarea
                            placeholder={`Output Value #${i + 1}`}
                            value={testCase.outputValue}
                            onChange={e => handleTestCaseChange(e, i, 'outputValue')}
                            required
                            className="test-case-textarea"
                        />
                        {testCases.length > 1 && (
                            <button type="button" className="remove-button" onClick={() => handleRemoveTestCase(i)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" className="add-button" onClick={handleAddTestCase}>문제 추가</button>

                <hr style={{ margin: '30px 0' }} />

                <button type="submit" className="submit-button-admin">문제 등록</button>
            </form>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}
        </div>
    );
}

export default ProblemAdminComponent;