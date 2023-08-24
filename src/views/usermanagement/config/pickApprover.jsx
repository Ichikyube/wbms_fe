import React, { useState } from "react";

const ChoosingPerson = ({ peopleList, onSelect }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    onSelect(person);
  };

  return (
    <div>
      <h2>Choose a Person</h2>
      <ul>
        {peopleList.map((person) => (
          <li
            key={person.id}
            onClick={() => handlePersonSelect(person)}
            style={{
              cursor: "pointer",
              fontWeight: selectedPerson === person ? "bold" : "normal",
            }}>
            {person.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChoosingPerson;
