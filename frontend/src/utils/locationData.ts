export interface CityEntry {
  name: string;
  state: string;
}

export interface StateEntry {
  name: string;
  cities: string[];
}

export const PAN_INDIA_VALUE = '__pan_india__';
export const PAN_INDIA_LABEL = 'Pan India – All Locations';

export const INDIA_STATES: StateEntry[] = [
  {
    name: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry'],
  },
  {
    name: 'Arunachal Pradesh',
    cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Ziro'],
  },
  {
    name: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
  },
  {
    name: 'Bihar',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah'],
  },
  {
    name: 'Chhattisgarh',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
  },
  {
    name: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  },
  {
    name: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand'],
  },
  {
    name: 'Haryana',
    cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Rohtak', 'Karnal', 'Sonipat'],
  },
  {
    name: 'Himachal Pradesh',
    cities: ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu'],
  },
  {
    name: 'Jharkhand',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  },
  {
    name: 'Karnataka',
    cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Davangere', 'Shimoga', 'Tumkur'],
  },
  {
    name: 'Kerala',
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur'],
  },
  {
    name: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna'],
  },
  {
    name: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Kolhapur'],
  },
  {
    name: 'Manipur',
    cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati'],
  },
  {
    name: 'Meghalaya',
    cities: ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara'],
  },
  {
    name: 'Mizoram',
    cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  },
  {
    name: 'Nagaland',
    cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  },
  {
    name: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
  },
  {
    name: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'],
  },
  {
    name: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Alwar', 'Bharatpur'],
  },
  {
    name: 'Sikkim',
    cities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo'],
  },
  {
    name: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode'],
  },
  {
    name: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'],
  },
  {
    name: 'Tripura',
    cities: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia'],
  },
  {
    name: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Ghaziabad', 'Noida', 'Bareilly', 'Aligarh', 'Moradabad'],
  },
  {
    name: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh'],
  },
  {
    name: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda'],
  },
  // Union Territories
  {
    name: 'Andaman & Nicobar Islands',
    cities: ['Port Blair', 'Diglipur', 'Rangat', 'Mayabunder', 'Car Nicobar'],
  },
  {
    name: 'Chandigarh',
    cities: ['Chandigarh', 'Manimajra', 'Panchkula', 'Mohali', 'Zirakpur'],
  },
  {
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    cities: ['Daman', 'Diu', 'Silvassa', 'Amli', 'Naroli'],
  },
  {
    name: 'Delhi',
    cities: ['New Delhi', 'Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Laxmi Nagar', 'Saket', 'Noida Extension'],
  },
  {
    name: 'Jammu & Kashmir',
    cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua'],
  },
  {
    name: 'Ladakh',
    cities: ['Leh', 'Kargil', 'Diskit', 'Padum', 'Nubra'],
  },
  {
    name: 'Lakshadweep',
    cities: ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy'],
  },
  {
    name: 'Puducherry',
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai'],
  },
];

/** Returns all city names across all states as a flat array */
export function getAllCities(): string[] {
  return INDIA_STATES.flatMap((s) => s.cities);
}

/** Returns all cities for a given state name */
export function getCitiesForState(stateName: string): string[] {
  const state = INDIA_STATES.find((s) => s.name === stateName);
  return state ? state.cities : [];
}

/** Returns the state name for a given city */
export function getStateForCity(cityName: string): string | null {
  for (const state of INDIA_STATES) {
    if (state.cities.includes(cityName)) return state.name;
  }
  return null;
}
