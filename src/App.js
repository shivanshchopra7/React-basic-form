import React, { useState, useEffect } from 'react';
import './style.css'; // Import CSS file


// Reusable Select Component
function SelectGroup({ heading, id, options, disabled, onChange, selectedOption }) {
  return (
    <div className="input-group">
      <p className="heading">{heading}</p>
      <select id={id} onChange={onChange} disabled={disabled} value={selectedOption}>
        <option value="select" disabled>Select</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

// Reusable Question Component
function Question({ question, onChange }) {
  return (
    <div>
      <p>{question}</p>
      <form>
        <label className="answer-label" htmlFor="yes">Yes</label>
        <input type="radio" id="yes" name="answer" value="yes" onChange={onChange}  />
        <label className="answer-label" htmlFor="no">No</label>
        <input type="radio" id="no" name="answer" value="no" onChange={onChange} />
      </form>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    selectedJoint: "",
    selectedSide: "",
    selectedInjury: "",
    answer1: "",
    answer2: "",
    answer3: ""
  });
  const [firstPhaseCompleted, setFirstPhaseCompleted] = useState(false);
  const [secondPhaseCompleted, setSecondPhaseCompleted] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false); // New state to track completion of second phase

  const handleInputChange = (key, value) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: value
    }));

    if (key === 'selectedInjury' && !firstPhaseCompleted) {
      setFirstPhaseCompleted(true);
      setStep(step + 1);
    }
    
    if (key.includes('answer')) {
      const answeredQuestions = Object.values(formData).filter(val => val !== "" && val !== "select").length;
      if (answeredQuestions === 6) {
        setSecondPhaseCompleted(true);
      }
    }
  };

  useEffect(() => {
    let progressHeight = 0;
    if (firstPhaseCompleted) {
      progressHeight += 50;
    }
    if (secondPhaseCompleted) {
      progressHeight += 50;
    }
    document.querySelector('.progress').style.height = `${progressHeight}%`;
    
    // Check if all questions in the second phase are answered
    const answeredQuestions = Object.values(formData).filter(val => val !== "" && val !== "select").length;
    if (firstPhaseCompleted && answeredQuestions === 6) {
      setSecondPhaseCompleted(true);
    }
    
    if (answeredQuestions === 6) {
      setAllQuestionsAnswered(true);
    }
  }, [firstPhaseCompleted, secondPhaseCompleted, formData]);

  return (
    <main>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
      <h1>Please Enter Patient Details</h1>
      <div id="list" className='list-container'>
    
        <SelectGroup
          heading="Select Joint"
          id="option1"
          options={[
            { value: "", label: "Select" },
            { value: "shoulder", label: "Shoulder joint" },
            { value: "elbow", label: "Elbow joint" },
            { value: "wrist", label: "Wrist joint" },
            { value: "hip", label: "Hip joint" },
            { value: "knee", label: "Knee joint" },
            { value: "ankle", label: "Ankle joint" },
            { value: "tmj", label: "Temporomandibular joint (TMJ)" },
            { value: "facet", label: "Spinal joints (facet joints)" }
          ]}
          disabled={false}
          onChange={(e) => handleInputChange("selectedJoint", e.target.value)}
          selectedOption={formData.selectedJoint}
          style={{ marginTop: '200px' }}
        />
        
        <SelectGroup
          heading="Select Side"
          id="option2"
          options={[
            { value: "", label: "Select" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" }
          ]}
          disabled={formData.selectedJoint === ""}
          onChange={(e) => handleInputChange("selectedSide", e.target.value)}
          selectedOption={formData.selectedSide}
        />
        <SelectGroup
          heading="Select injury"
          id="option3"
          options={[
            { value: "", label: "Select" },
            { value: "contusion", label: "Contusion" },
            { value: "fracture", label: "Fracture" },
            { value: "sprain", label: "Sprain" },
            { value: "strain", label: "Strain" },
            { value: "abrasion", label: "Abrasion" }
          ]}
          disabled={formData.selectedSide === ""}
          onChange={(e) => handleInputChange("selectedInjury", e.target.value)}
          selectedOption={formData.selectedInjury}
        />
      </div>
      {firstPhaseCompleted && (
        <div className="question-container">
          <h3 >Please Answer Questions</h3>
          <Question question="Are you experiencing any numbness or tingling sensation or radiating pain?" onChange={(e) => handleInputChange("answer1", e.target.value)} />
          <Question question="Have you experienced any recent trauma or injury to your spine?" onChange={(e) => handleInputChange("answer2", e.target.value)} />
          <Question question="Are you able to walk?" onChange={(e) => handleInputChange("answer3", e.target.value)} />
        </div>
      )}
      {allQuestionsAnswered && (
        <button id="submitBtn" onClick={() => setStep(step)}>Submit</button>
      )}
    </main>
  );
}

export default App;
