$(document).ready(function () {
    // Função para garantir que apenas números sejam digitados
    function apenasNumeros(event) {
        var charCode = event.charCode || event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    // Função para formatar o CPF com pontos e traço
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove tudo o que não é número
        if (cpf.length <= 3) {
            return cpf;
        } else if (cpf.length <= 6) {
            return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        } else if (cpf.length <= 9) {
            return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        }
    }

    // Função para formatar a data no formato brasileiro (DD/MM/YYYY)
    function formatarData(dataISO) {
        if (!dataISO) return ""; // Retorna vazio caso o valor seja inválido
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Atribuindo a função aos campos de CPF, RG e número do endereço
    $('#declarante1_rg').on('keypress', apenasNumeros);
    $('#declarante1_cpf').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    });
    $('#declarante2_rg').on('keypress', apenasNumeros);
    $('#declarante2_cpf').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    });

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#declarante1_nome').val(),
            $('#declarante1_rg').val(),
            $('#declarante1_cpf').val(),
            $('#declarante2_nome').val(),
            $('#declarante2_rg').val(),
            $('#declarante2_cpf').val(),
            $('#endereco_completo').val(),
            $('#inicio_convivencia').val(),
            $('#checkbox_termos').is(':checked') // Verifica se o checkbox foi marcado
        ];

        // Se algum campo estiver vazio ou o checkbox não estiver marcado, retorna falso
        return camposObrigatorios.every(campo => campo !== "" && campo !== false);
    }

    // Ao clicar no botão de gerar PDF
    $('#gerarPDF').click(function () {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!validarCampos()) {
            alert('Por favor, preencha todos os campos obrigatórios antes de gerar o PDF.');
            return; // Impede a geração do PDF se algum campo estiver vazio
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Coletando os dados dos campos do formulário
        const declarante1Nome = $('#declarante1_nome').val();
        const declarante1RG = $('#declarante1_rg').val();
        const declarante1CPF = $('#declarante1_cpf').val();
        const declarante2Nome = $('#declarante2_nome').val();
        const declarante2RG = $('#declarante2_rg').val();
        const declarante2CPF = $('#declarante2_cpf').val();
        const enderecoCompleto = $('#endereco_completo').val();
        const inicioConvivencia = formatarData($('#inicio_convivencia').val()); // Formata a data

        // Configurações gerais
        const margemEsquerda = 10; // Margem esquerda do documento
        const larguraTexto = 190; // Largura máxima do texto (A4 = 210mm - margens)
        let y = 40; // Posição inicial no eixo Y

        doc.setFontSize(12);

        // Título do documento
        doc.text('DECLARAÇÃO DE UNIÃO ESTÁVEL', 105, 20, null, null, 'center');

        // Corpo da Declaração
        const textoCorpo = `Eu, ${declarante1Nome}, RG nº ${declarante1RG} e CPF nº ${declarante1CPF}, e ${declarante2Nome}, RG nº ${declarante2RG} e CPF nº ${declarante2CPF}, ambos residentes e domiciliados à ${enderecoCompleto}, declaramos para os devidos fins que mantemos uma união estável, em caráter permanente e contínuo, com a intenção de constituir família, conforme os requisitos previstos pela legislação brasileira.`;

        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8;

        const textoConvicencia = 'A nossa convivência é pública, contínua, duradoura e com o objetivo de constituir uma família, sendo reconhecida pela sociedade como tal. A união estável teve início em ' + inicioConvivencia + ' e, desde então, convivemos sob o mesmo teto, compartilhando as responsabilidades e deveres próprios de uma vida a dois.';
        const linhasConvicencia = doc.splitTextToSize(textoConvicencia, larguraTexto);
        doc.text(linhasConvicencia, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasConvicencia.length * 8;

        const textoDireitos = 'Declaramos ainda que estamos cientes dos direitos e deveres decorrentes dessa união, e que a mesma não é configurada como um casamento, mas como uma convivência duradoura e estável, com a intenção de formar uma família.';
        const linhasDireitos = doc.splitTextToSize(textoDireitos, larguraTexto);
        doc.text(linhasDireitos, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasDireitos.length * 8;

        // Declaração adicional
        const textoAdicional = 'Por ser expressão da verdade, firmamos a presente declaração para que produza os efeitos legais.';
        const linhasAdicional = doc.splitTextToSize(textoAdicional, larguraTexto);
        doc.text(linhasAdicional, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasAdicional.length * 8;

        // Local e Data
        doc.text('Local e Data: ________________, ____, ______________, 202_.', margemEsquerda, y);
        y += 25;

        // Assinaturas
        doc.text('Assinatura do Declarante 1: ______________________', margemEsquerda, y);
        y += 20;
        doc.text('Assinatura do Declarante 2: ______________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('declaracao_uniao_estavel.pdf');
    });
});
