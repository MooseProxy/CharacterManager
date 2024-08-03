import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './CharacterForm.css';

const CharacterForm = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    archetype: '',
    strength: '',
    body: '',
    quickness: '',
    intelligence: '',
    willpower: '',
    charisma: '',
    reaction: '',
    initiative: '',
    essence: '',
    magic: '',
    edge: '',
    skills: [],
    gear: [],
    cyberware: [],
    bioware: [],
    ranged_weapons: [],
    melee_weapons: []
  });
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/characters')
        .then((response) => {
          setCharacters(response.data);
        })
        .catch((error) => {
          console.error('Error fetching characters:', error);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (e, field, index, key) => {
    const newArray = [...formData[field]];
    newArray[index][key] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addNewItem = (field) => {
    const newArray = [...formData[field], { name: '', rating: 0 }];
    setFormData({ ...formData, [field]: newArray });
  };

  const deleteItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCharacter) {
      axios.put(`http://localhost:5000/characters/${selectedCharacter}`, formData)
        .then((response) => {
          setCharacters(characters.map((char) => (char._id === selectedCharacter ? response.data : char)));
          setSelectedCharacter('');
          resetForm();
          setIsEditing(false);
        })
        .catch((error) => {
          console.error('Error updating character:', error);
        });
    } else {
      axios.post('http://localhost:5000/characters', formData)
        .then((response) => {
          setCharacters([...characters, response.data]);
          resetForm();
          setIsAdding(false);
        })
        .catch((error) => {
          console.error('Error adding character:', error);
        });
    }
  };

  const handleSelectChange = (e) => {
    const characterId = e.target.value;
    setSelectedCharacter(characterId);
    if (characterId) {
      const character = characters.find((char) => char._id === characterId);
      setFormData({
        ...character,
        skills: character.skills || [],
        gear: character.gear || [],
        cyberware: character.cyberware || [],
        bioware: character.bioware || [],
        ranged_weapons: character.ranged_weapons || [],
        melee_weapons: character.melee_weapons || []
      });
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  };



  const resetForm = () => {
    setFormData({
      name: '',
      race: '',
      archetype: '',
      strength: '',
      body: '',
      quickness: '',
      intelligence: '',
      willpower: '',
      charisma: '',
      reaction: '',
      initiative: '',
      essence: '',
      magic: '',
      edge: '',
      skills: [],
      gear: [],
      cyberware: [],
      bioware: [],
      ranged_weapons: [],
      melee_weapons: []
    });
  };

  const handleAddNewCharacter = () => {
    resetForm();
    setIsAdding(true);
    setSelectedCharacter('');
    setIsEditing(false);
  };

  if (!user) {
    return <div>Please login to manage your characters.</div>;
  }

  return (
    <div className="character-container">
      <h1>Shadowrun Character Database</h1>
      <div className="character-dropdown">
        <label htmlFor="character-select">Select a Character:</label>
        <select id="character-select" value={selectedCharacter} onChange={handleSelectChange}>
          <option value="">--Please choose a character--</option>
          {characters.map((character) => (
            <option key={character._id} value={character._id}>
              {character.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddNewCharacter}>Add New Character</button>
      </div>
      {(isEditing || isAdding) && (
        <form onSubmit={handleSubmit} className="character-form">
          <div className="form-group">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <input type="text" name="race" placeholder="Race" value={formData.race} onChange={handleChange} />
            <input type="text" name="archetype" placeholder="Archetype" value={formData.archetype} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="number" name="strength" placeholder="Strength" value={formData.strength} onChange={handleChange} />
            <input type="number" name="body" placeholder="Body" value={formData.body} onChange={handleChange} />
            <input type="number" name="quickness" placeholder="Quickness" value={formData.quickness} onChange={handleChange} />
            <input type="number" name="intelligence" placeholder="Intelligence" value={formData.intelligence} onChange={handleChange} />
            <input type="number" name="willpower" placeholder="Willpower" value={formData.willpower} onChange={handleChange} />
            <input type="number" name="charisma" placeholder="Charisma" value={formData.charisma} onChange={handleChange} />
            <input type="number" name="reaction" placeholder="Reaction" value={formData.reaction} onChange={handleChange} />
            <input type="number" name="initiative" placeholder="Initiative" value={formData.initiative} onChange={handleChange} />
            <input type="number" name="essence" placeholder="Essence" value={formData.essence || ''} onChange={handleChange} />
            <input type="number" name="magic" placeholder="Magic" value={formData.magic || ''} onChange={handleChange} />
            <input type="number" name="edge" placeholder="Edge" value={formData.edge || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Skills</label>
            {formData.skills.map((skill, index) => (
              <div key={index}>
                <input type="text" name={`skill-${index}`} placeholder="Skill" value={skill.name} onChange={(e) => handleArrayChange(e, 'skills', index, 'name')} />
                <input type="number" name={`skill-rating-${index}`} placeholder="Rating" value={skill.rating} onChange={(e) => handleArrayChange(e, 'skills', index, 'rating')} />
                <button type="button" onClick={() => deleteItem('skills', index)}>Delete Skill</button>
              </div>
            ))}
            <button type="button" onClick={() => addNewItem('skills')}>Add Skill</button>
          </div>
          <div className="form-group">
            <label>Gear</label>
            {formData.gear.map((item, index) => (
              <div key={index}>
                <input type="text" name={`gear-${index}`} placeholder="Gear" value={item.name} onChange={(e) => handleArrayChange(e, 'gear', index, 'name')} />
                <input type="number" name={`gear-rating-${index}`} placeholder="Rating" value={item.rating} onChange={(e) => handleArrayChange(e, 'gear', index, 'rating')} />
                <button type="button" onClick={() => deleteItem('gear', index)}>Delete Gear</button>
              </div>
            ))}
            <button type="button" onClick={() => addNewItem('gear')}>Add Gear</button>
          </div>
          <div className="form-group">
            <label>Cyberware</label>
            {formData.cyberware.map((item, index) => (
              <div key={index}>
                <input type="text" name={`cyberware-${index}`} placeholder="Cyberware" value={item.name} onChange={(e) => handleArrayChange(e, 'cyberware', index, 'name')} />
                <input type="number" name={`cyberware-rating-${index}`} placeholder="Rating" value={item.rating} onChange={(e) => handleArrayChange(e, 'cyberware', index, 'rating')} />
                <button type="button" onClick={() => deleteItem('cyberware', index)}>Delete Cyberware</button>
              </div>
            ))}
            <button type="button" onClick={() => addNewItem('cyberware')}>Add Cyberware</button>
          </div>
          <div className="form-group">
            <label>Bioware</label>
            {formData.bioware.map((item, index) => (
              <div key={index}>
                <input type="text" name={`bioware-${index}`} placeholder="Bioware" value={item.name} onChange={(e) => handleArrayChange(e, 'bioware', index, 'name')} />
                <input type="number" name={`bioware-rating-${index}`} placeholder="Rating" value={item.rating} onChange={(e) => handleArrayChange(e, 'bioware', index, 'rating')} />
                <button type="button" onClick={() => deleteItem('bioware', index)}>Delete Bioware</button>
              </div>
            ))}
            <button type="button" onClick={() => addNewItem('bioware')}>Add Bioware</button>
            <button type="submit">{selectedCharacter ? 'Update Character' : 'Add Character'}</button>
          </div>
        
        </form>
      )}
      {selectedCharacter && (
        <div className="character-details">
          <h2>{formData.name}</h2>
          <p>Race: {formData.race}</p>
          <p>Archetype: {formData.archetype}</p>
          <p>Strength: {formData.strength}</p>
          <p>Body: {formData.body}</p>
          <p>Quickness: {formData.quickness}</p>
          <p>Intelligence: {formData.intelligence}</p>
          <p>Willpower: {formData.willpower}</p>
          <p>Charisma: {formData.charisma}</p>
          <p>Reaction: {formData.reaction}</p>
          <p>Initiative: {formData.initiative}</p>
          <p>Essence: {formData.essence}</p>
          <p>Magic: {formData.magic}</p>
          <p>Edge: {formData.edge}</p>
          <p>Skills: {formData.skills.map(skill => `${skill.name} (Rating: ${skill.rating})`).join(', ')}</p>
          <p>Gear: {formData.gear.map(item => `${item.name} (Rating: ${item.rating})`).join(', ')}</p>
          <p>Cyberware: {formData.cyberware.map(item => `${item.name} (Rating: ${item.rating})`).join(', ')}</p>
          <p>Bioware: {formData.bioware.map(item => `${item.name} (Rating: ${item.rating})`).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterForm;
