import Mailer from 'react-native-mail';
import { UserInfo } from '../types';

// Função para enviar e-mail de confirmação após login bem-sucedido
export const sendConfirmationEmail = (user: UserInfo): Promise<boolean> => {
  return new Promise((resolve) => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    
    Mailer.mail(
      {
        subject: 'Confirmação de Login',
        recipients: [user.email],
        body: `
          <h2>Olá, ${user.name || user.email}!</h2>
          <p>Este é um e-mail de confirmação para informar que você realizou login com sucesso no nosso aplicativo.</p>
          <p><strong>Data e hora do login:</strong> ${formattedDate}</p>
          <p>Se você não reconhece esta atividade, por favor entre em contato conosco imediatamente.</p>
          <p>Atenciosamente,<br>Equipe de Suporte</p>
        `,
        isHTML: true,
      },
      (error) => {
        if (error) {
          console.error('Error sending email: ', error);
          resolve(false);
        } else {
          console.log('Email sent successfully');
          resolve(true);
        }
      }
    );
  });
};