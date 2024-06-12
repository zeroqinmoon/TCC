const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Configuração do body-parser para lidar com dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para lidar com o envio do formulário de contato
app.post('/send-email', async (req, res) => {
  try {
    // Extraindo os dados do formulário
    const { name, message } = req.body;

    // Verificando se os campos estão preenchidos
    if (!name || !message) {
      throw new Error('Os campos de nome e mensagem são obrigatórios.');
    }

    // Configuração do transporte de e-mail usando Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Substitua por 'smtp.gmail.com'
      port: 587, // Substitua por 587
      secure: true, // Use TLS para garantir a segurança
      auth: {
        user: 'erenoyeager12334@gmail.com', // Insira seu email do Gmail
        pass: 'sua_senha_de_aplicativo', // Use uma senha de aplicativo específica
      },
    });

    // Configuração do email a ser enviado
    const mailOptions = {
      from: 'seu_email@gmail.com', // Insira seu email do Gmail
      to: 'destinatario@exemplo.com', // Insira o email de destino
      subject: 'Novo contato do formulário de contato',
      text: `Nome: ${name}\nMensagem: ${message}`,
    };

    // Envio do email
    await transporter.sendMail(mailOptions);

    // Resposta em caso de sucesso
    res.status(200).send('E-mail enviado com sucesso!');
  } catch (error) {
    // Tratamento de erros
    console.error(error);
    res.status(500).send('Ocorreu um erro ao enviar o e-mail.');
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
