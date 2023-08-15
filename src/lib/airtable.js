import Airtable from 'airtable';

const key = process.env.AIRTABLE_API_KEY;
const id = process.env.AIRTABLE_BASE_ID;

Airtable.configure({
    apiKey: key
});

const base = Airtable.base(id);

export default base;
