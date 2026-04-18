import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, CheckSquare, Square, CheckCircle2, Circle } from 'lucide-react';

interface Character {
  id: string;
  serial: string;
  name: string;
  costume: string;
  props: string;
  isChecked: boolean;
  checkedCostumes?: string[];
  checkedProps?: string[];
}

const INITIAL_DATA: Character[] = [
  { id: '1', serial: '1', name: 'पहिल पुरुष (कक्का)', costume: 'धोती-कुर्ता या शर्ट-फुल पैंट, चमड़े की चप्पल, गमछा', props: 'छाता, हैंडस्टिक (लाठी), चीनौटी', isChecked: false },
  { id: '2', serial: '2', name: 'दोसर पुरुष (रामेश्वर)', costume: 'शर्ट-फुल पैंट या धोती-कुर्ता, चमड़े की चप्पल, गमछा', props: 'हाथ वाली चैन की घड़ी', isChecked: false },
  { id: '3', serial: '3', name: 'तेसर पुरुष (चंदु)', costume: 'शर्ट-फुल पैंट या धोती-कुर्ता, चमड़े की चप्पल, गमछा', props: '-', isChecked: false },
  { id: '4', serial: '4', name: 'चारिम पुरुष (जहीर)', costume: 'लुंगी और शर्ट/T-शर्ट, गले में जंतर, माथे पर इस्लामी टोपी, चमड़े की चप्पल, गमछा', props: '-', isChecked: false },
  { id: '5', serial: '5', name: 'पाँचम पुरुष (चरित्तर)', costume: 'धोती-कुर्ता या शर्ट-फुल पैंट, चमड़े की चप्पल, गमछा', props: '-', isChecked: false },
  { id: '6', serial: '6', name: 'छठम पुरुष', costume: 'गंजी, हाफ धोती, गमछा', props: '-', isChecked: false },
  { id: '7', serial: '7', name: 'सातम पुरुष (हवलदार)', costume: 'हवलदार की ड्रेस (खाकी), जूता, मोजा', props: 'डंडा (Lathi), सीटी', isChecked: false },
  { id: '8', serial: '8', name: 'आठम पुरुष (दारोगा)', costume: 'पुलिस इंस्पेक्टर की वर्दी (सितारों वाली), बेल्ट, जूता-मोजा', props: 'पेन, डायरी, पिस्तौल का कवर (Holster)', isChecked: false },
  { id: '9', serial: '9', name: 'नवम पुरुष (गोबर्धनमा)', costume: 'लोफर शर्ट, प्रिंटेड T-शर्ट, जींस/पैंट, कैजुअल शू, गमछा', props: 'उंगलियों में अंगूठी, गले में चैन (गुंडा लुक)', isChecked: false },
  { id: '10', serial: '10', name: 'पहिल युवक (पाबना/मिता)', costume: 'लोफर/प्रिंटेड शर्ट, जींस, जूता', props: 'कीपैड मोबाइल', isChecked: false },
  { id: '11', serial: '11', name: 'दोसर युवक (बिलटा)', costume: 'लोफर/प्रिंटेड शर्ट, जींस/फुल पैंट, जूता', props: '-', isChecked: false },
  { id: '12', serial: '12', name: 'तेसर युवक (रबिया)', costume: 'लोफर/प्रिंटेड शर्ट, जींस/फुल पैंट, जूता', props: '-', isChecked: false },
  { id: '13', serial: '13', name: 'चारिम युवक', costume: 'हाफ बांह की गंजी, पायजामा, गमछा', props: 'चाय के गिलास/ट्रे (दुकान के लिए)', isChecked: false },
  { id: '14', serial: '14', name: 'युवती', costume: 'लहंगा, ब्लाउज, दो दुपट्टा (ग्रामीण लुक)', props: 'चाय बनाने का सामान, केतली, अंगीठी', isChecked: false },
  { id: '15', serial: '15', name: 'ग्रामीण स्त्री (कोरस)', costume: 'देहाती तरीके से पहनी गई साड़ी, बिंदी, चूड़ियाँ', props: 'टोकरी या बर्तन (दृश्य के अनुसार)', isChecked: false },
];

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem('character_tracker_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Local storage data corrupt", e);
      }
    }
    return INITIAL_DATA;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Character | null>(null);

  // Save to "Database" (LocalStorage) whenever characters change
  useEffect(() => {
    localStorage.setItem('character_tracker_db', JSON.stringify(characters));
  }, [characters]);

  const toggleCostume = (id: string, item: string) => {
    setCharacters(chars => chars.map(c => {
      if (c.id !== id) return c;
      const list = c.checkedCostumes || [];
      const isChecked = list.includes(item);
      return { ...c, checkedCostumes: isChecked ? list.filter(i => i !== item) : [...list, item] };
    }));
  };

  const toggleProp = (id: string, item: string) => {
    setCharacters(chars => chars.map(c => {
      if (c.id !== id) return c;
      const list = c.checkedProps || [];
      const isChecked = list.includes(item);
      return { ...c, checkedProps: isChecked ? list.filter(i => i !== item) : [...list, item] };
    }));
  };

  const renderSubItems = (char: Character, field: 'costume' | 'props') => {
    const isCostume = field === 'costume';
    const rawText = isCostume ? char.costume : char.props;
    if (!rawText || rawText.trim() === '-') return <span className="text-[rgba(255,255,255,0.4)]">-</span>;
    
    // Split by comma and filter empty ones
    const items = rawText.split(',').map(s => s.trim()).filter(s => s);
    const checkedList = isCostume ? (char.checkedCostumes || []) : (char.checkedProps || []);
    
    return (
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => {
          const isChecked = checkedList.includes(item);
          return (
            <div key={idx} 
              className={`flex items-start gap-2 cursor-pointer group ${char.isChecked ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                isCostume ? toggleCostume(char.id, item) : toggleProp(char.id, item);
              }}
            >
              <div className="mt-[2px] flex-shrink-0">
                 {isChecked ? (
                   <CheckSquare className="w-[14px] h-[14px] text-[#70E0FF]" />
                 ) : (
                   <Square className="w-[14px] h-[14px] text-[rgba(255,255,255,0.3)] group-hover:text-[#70E0FF] transition-colors" />
                 )}
              </div>
              <span className={`text-[13px] leading-tight transition-colors ${isChecked ? 'line-through text-[rgba(255,255,255,0.5)]' : 'text-[rgba(255,255,255,0.9)] group-hover:text-white'}`}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const toggleCheck = (id: string) => {
    setCharacters(chars => 
      chars.map(c => c.id === id ? { ...c, isChecked: !c.isChecked } : c)
    );
  };

  const startEdit = (char: Character) => {
    setEditingId(char.id);
    setEditFormData({ ...char });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const saveEdit = () => {
    if (editFormData) {
      setCharacters(chars => 
        chars.map(c => c.id === editFormData.id ? editFormData : c)
      );
      setEditingId(null);
      setEditFormData(null);
    }
  };

  const handleEditChange = (field: keyof Character, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const resetData = () => {
    if (confirm('क्या आप सभी डेटा को रीसेट करना चाहते हैं? (Are you sure you want to reset to default?)')) {
      setCharacters(INITIAL_DATA);
    }
  };

  return (
    <div 
      className="min-h-screen font-sans p-4 md:p-8 flex items-center justify-center overflow-auto text-white"
      style={{
        backgroundColor: '#0F172A',
        backgroundImage: `
          radial-gradient(at 0% 0%, #1e293b 0px, transparent 50%),
          radial-gradient(at 100% 0%, #334155 0px, transparent 50%),
          radial-gradient(at 100% 100%, #1e3a8a 0px, transparent 50%),
          radial-gradient(at 0% 100%, #312e81 0px, transparent 50%)
        `
      }}
    >
      <div className="w-full max-w-5xl h-[85vh] min-h-[600px] flex flex-col bg-[rgba(255,255,255,0.12)] backdrop-blur-[25px] border border-[rgba(255,255,255,0.25)] rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 p-6 md:p-8 min-h-0 overflow-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                पात्र परिचय एवं वेशभूषा
              </h1>
              <p className="text-[13px] text-[rgba(255,255,255,0.6)] mt-1 tracking-wider uppercase">
                Characters & Costumes
              </p>
            </div>
            
            <div className="flex gap-3">
               <button 
                onClick={resetData}
                className="px-4 py-2 text-sm font-medium text-red-300 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded-xl transition-colors border border-[rgba(255,255,255,0.1)]"
               >
                 Reset
               </button>
               <div className="text-sm px-4 py-2 bg-[rgba(112,224,255,0.1)] text-[#70E0FF] rounded-xl font-medium border border-[rgba(112,224,255,0.2)]">
                 {characters.filter(c => c.isChecked).length} / {characters.length} Complete
               </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.25)] overflow-hidden shadow-inner">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-auto flex-1">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.6)] font-semibold border-b border-[rgba(255,255,255,0.25)] sticky top-0 backdrop-blur-xl z-10">
                  <tr>
                    <th className="p-4 w-16 text-center whitespace-nowrap font-semibold">तैयार?</th>
                    <th className="p-4 w-16 whitespace-nowrap font-semibold">क्र.सं.</th>
                    <th className="p-4 w-1/4 font-semibold">पात्र का नाम</th>
                    <th className="p-4 w-1/3 font-semibold">वेशभूषा (Costume)</th>
                    <th className="p-4 w-1/4 font-semibold">आवश्यक सामग्री (Props)</th>
                    <th className="p-4 w-20 text-center whitespace-nowrap font-semibold">एक्शन</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                  {characters.map((char) => {
                    const isEditing = editingId === char.id;
                    
                    return (
                      <tr 
                        key={char.id} 
                        className={`transition-colors hover:bg-[rgba(255,255,255,0.05)] ${char.isChecked && !isEditing ? 'bg-[rgba(112,224,255,0.05)]' : ''}`}
                      >
                        <td className="p-4 text-center cursor-pointer" onClick={() => !isEditing && toggleCheck(char.id)}>
                          <button className="text-[rgba(255,255,255,0.4)] hover:text-[#70E0FF] transition-colors focus:outline-none">
                            {char.isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-[#70E0FF]" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        </td>

                        {isEditing && editFormData ? (
                          <>
                            <td className="p-4">
                              <input 
                                value={editFormData.serial}
                                onChange={(e) => handleEditChange('serial', e.target.value)}
                                className="w-full px-2 py-1.5 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm focus:outline-none focus:border-[#70E0FF] transition-colors"
                              />
                            </td>
                            <td className="p-4">
                              <input 
                                value={editFormData.name}
                                onChange={(e) => handleEditChange('name', e.target.value)}
                                className="w-full px-2 py-1.5 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm focus:outline-none focus:border-[#70E0FF] transition-colors"
                              />
                            </td>
                            <td className="p-4">
                              <textarea 
                                value={editFormData.costume}
                                onChange={(e) => handleEditChange('costume', e.target.value)}
                                className="w-full px-2 py-1.5 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm min-h-[60px] focus:outline-none focus:border-[#70E0FF] transition-colors resize-y"
                              />
                            </td>
                            <td className="p-4">
                               <textarea 
                                value={editFormData.props}
                                onChange={(e) => handleEditChange('props', e.target.value)}
                                className="w-full px-2 py-1.5 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm min-h-[60px] focus:outline-none focus:border-[#70E0FF] transition-colors resize-y"
                              />
                            </td>
                            <td className="p-4 text-center align-middle">
                              <div className="flex flex-col gap-2 items-center">
                                <button onClick={saveEdit} className="p-1.5 text-[#70E0FF] hover:bg-[rgba(112,224,255,0.1)] rounded transition-colors" title="Save">
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEdit} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Cancel">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className={`p-4 font-mono text-[rgba(255,255,255,0.6)] ${char.isChecked ? 'line-through opacity-50' : ''}`}>
                              {char.serial}
                            </td>
                            <td className={`p-4 text-white ${char.isChecked ? 'line-through opacity-50 text-[rgba(255,255,255,0.6)]' : ''}`}>
                              {char.name}
                            </td>
                            <td className="p-4 align-top">
                              {renderSubItems(char, 'costume')}
                            </td>
                            <td className="p-4 align-top">
                              {renderSubItems(char, 'props')}
                            </td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => startEdit(char)}
                                className="p-2 text-[rgba(255,255,255,0.4)] hover:text-[#70E0FF] hover:bg-[rgba(112,224,255,0.1)] rounded-lg transition-colors focus:outline-none"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="flex flex-col md:hidden overflow-auto p-4 gap-4 flex-1">
              {characters.map((char) => {
                const isEditing = editingId === char.id;

                if (isEditing && editFormData) {
                  return (
                     <div key={char.id} className="bg-[rgba(0,0,0,0.3)] p-4 rounded-xl border border-[rgba(255,255,255,0.25)] flex flex-col gap-3 shadow-lg">
                        <div>
                          <label className="text-xs text-[rgba(255,255,255,0.6)] mb-1 block uppercase tracking-wider">क्र.सं.</label>
                          <input 
                            value={editFormData.serial}
                            onChange={(e) => handleEditChange('serial', e.target.value)}
                            className="w-full px-3 py-2 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm focus:outline-none focus:border-[#70E0FF] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[rgba(255,255,255,0.6)] mb-1 block uppercase tracking-wider">पात्र का नाम</label>
                          <input 
                            value={editFormData.name}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm focus:outline-none focus:border-[#70E0FF] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[rgba(255,255,255,0.6)] mb-1 block uppercase tracking-wider">वेशभूषा (Costume)</label>
                          <textarea 
                            value={editFormData.costume}
                            onChange={(e) => handleEditChange('costume', e.target.value)}
                            className="w-full px-3 py-2 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm min-h-[60px] focus:outline-none focus:border-[#70E0FF] transition-colors resize-y"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[rgba(255,255,255,0.6)] mb-1 block uppercase tracking-wider">आवश्यक सामग्री (Props)</label>
                           <textarea 
                            value={editFormData.props}
                            onChange={(e) => handleEditChange('props', e.target.value)}
                            className="w-full px-3 py-2 border border-[rgba(255,255,255,0.25)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white text-sm min-h-[60px] focus:outline-none focus:border-[#70E0FF] transition-colors resize-y"
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-3 border-t border-[rgba(255,255,255,0.1)] mt-1">
                           <button onClick={cancelEdit} className="px-4 py-2 text-sm text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors border border-transparent">
                              Cancel
                            </button>
                            <button onClick={saveEdit} className="px-4 py-2 text-sm bg-[rgba(112,224,255,0.1)] text-[#70E0FF] hover:bg-[rgba(112,224,255,0.2)] rounded-lg flex items-center gap-2 border border-[rgba(112,224,255,0.2)] transition-colors shadow-sm">
                              <Save className="w-4 h-4" /> Save
                            </button>
                        </div>
                     </div>
                  )
                }

                return (
                  <div 
                    key={char.id} 
                    className={`bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border transition-all shadow-sm ${
                      char.isChecked ? 'border-[rgba(112,224,255,0.3)] bg-[rgba(112,224,255,0.05)]' : 'border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={() => toggleCheck(char.id)}
                        className="mt-1 flex-shrink-0 text-[rgba(255,255,255,0.4)] hover:text-[#70E0FF] transition-colors focus:outline-none"
                      >
                        {char.isChecked ? (
                          <CheckCircle2 className="w-6 h-6 text-[#70E0FF] filter drop-shadow-[0_0_8px_rgba(112,224,255,0.4)]" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>

                      <div className={`flex-1 space-y-3 ${char.isChecked ? 'opacity-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono text-[rgba(255,255,255,0.5)] mb-1 block">#{char.serial}</span>
                            <h3 className={`font-semibold text-lg text-white ${char.isChecked ? 'line-through' : ''}`}>
                              {char.name}
                            </h3>
                          </div>
                          <button 
                             onClick={() => startEdit(char)}
                             className="p-2 text-[rgba(255,255,255,0.4)] hover:text-[#70E0FF] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors focus:outline-none -mr-2 -mt-2"
                          >
                             <Edit2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-[rgba(0,0,0,0.2)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] shadow-inner">
                            <span className="w-full text-[10px] font-bold uppercase tracking-widest text-[rgba(255,255,255,0.4)] block mb-3">
                              वेशभूषा
                            </span>
                            <div className="text-sm">
                              {renderSubItems(char, 'costume')}
                            </div>
                          </div>

                          <div className="bg-[rgba(0,0,0,0.2)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] shadow-inner">
                            <span className="w-full text-[10px] font-bold uppercase tracking-widest text-[rgba(255,255,255,0.4)] block mb-3">
                              आवश्यक सामग्री
                            </span>
                            <div className="text-sm">
                              {renderSubItems(char, 'props')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
