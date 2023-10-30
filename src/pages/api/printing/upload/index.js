import { uploadFiles } from '@/pages/api/firebase';
import { IncomingForm } from 'formidable';

import { validateRequest } from '@/lib/auth';

import { PITypes } from '@/util/roles';

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let uid,
            allowed = await validateRequest(req, PITypes.PI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        // load formdata from body
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        console.log(data);

        const files = Object.values(data.files);
        const name = data.fields.name;

        const urls = await uploadFiles(files, name);

        return res.status(200).json({ urls: urls });
    }
}
