const express = require('express'); // importa o express
const nodemailer = require('nodemailer'); // importa o nodemailer
const bodyParser = require('body-parser'); // importa o body-parser

// configura a inicializacao
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Gerar conta de serviço SMTP para testes com o Ethereal
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Falha ao criar uma conta de teste. ' + err.message);
        return process.exit(1);
    }

    console.log('Credenciais obtidas, enviando mensagem...');

    // Criar objeto transporter SMTP
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    // Endpoint para lidar com envios de formulários
    app.post('/send-email', (req, res) => {
        const { name, message } = req.body;

        // Configurar objeto da mensagem
        let mailOptions = {
            from: 'Sender Name <sender@example.com>', // Substitua pelo seu endereço de remetente(opcional)
            to: 'Recipient <recipient@example.com>',   // Substitua pelo endereço do destinatário(opcional)
            subject: 'Envio de Formulário de Contato', // Objetivo da mensagem
            text: `Nome: ${name}\nMensagem: ${message}`, // Recebe a mensagem do html via post
            html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Mensagem:</strong> ${message}</p>` // Recebe o texto do html via post
        };

        // Enviar e-mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Ocorreu um erro. ' + err.message); // auto explicativo
                return res.status(500).json({ success: false, message: 'Erro ao enviar o e-mail.' });
            }

            console.log('Mensagem enviada: %s', info.messageId); // auto explicativo
            console.log('URL de visualização: %s', nodemailer.getTestMessageUrl(info));
            res.status(200).json({ success: true, message: 'E-mail enviado com sucesso.' });
        });
    });

    // Servir a página HTML estática, resumo: cria uma pagina para verificar se enviou ou nao
    app.use(express.static('public'));

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`); // mostra o link do email enviado no sistema de testes.
    });
});
