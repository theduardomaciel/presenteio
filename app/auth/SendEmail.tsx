import { render } from '@react-email/render';
import sendgrid from '@sendgrid/mail';

import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailProps {
    code: string;
    name: string;
}

function Email({ code, name }: EmailProps) {
    return (
        <Html lang="pt-br">
            <h1>Olá, seja bem vindo ao Presenteio!</h1>
        </Html>
    );
}

export default async function sendEmailWithCode(emailProps: EmailProps, emailToSend: string) {
    const emailHtml = render(<Email {...emailProps} />);

    const options = {
        from: 'app.presenteio@presenteio.com',
        to: emailToSend,
        subject: 'hello world',
        html: emailHtml,
    };

    sendgrid.send(options);
}