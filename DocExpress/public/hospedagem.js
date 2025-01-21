$(document).ready(function () {
    // Função para formatar o CPF enquanto o usuário digita
    function formatarCPF(campo) {
        let cpf = campo.val().replace(/\D/g, ''); // Remove tudo que não é número
        if (cpf.length > 11) cpf = cpf.slice(0, 11); // Limita a 11 caracteres
        campo.val(
            cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, function (_, p1, p2, p3, p4) {
                return `${p1}.${p2}.${p3}-${p4 || ''}`;
            })
        );
    }

    // Função para garantir que apenas números sejam digitados
    function apenasNumeros(event) {
        var charCode = event.charCode || event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    // Função para formatar data no formato brasileiro (DD/MM/YYYY)
    function formatarData(dataISO) {
        if (!dataISO) return ""; // Retorna vazio caso o valor seja inválido
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Atribuindo a função aos campos de CPF e RG
    $('#responsavel_cpf, #menor_cpf').on('input', function () {
        formatarCPF($(this));
    }).on('keypress', apenasNumeros);

    $('#responsavel_rg').on('keypress', apenasNumeros);

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#responsavel_nome').val(),
            $('#responsavel_rg').val(),
            $('#responsavel_cpf').val(),
            $('#endereco').val(),
            $('#numero').val(),
            $('#bairro').val(),
            $('#cidade').val(),
            $('#estado').val(),
            $('#menor_nome').val(),
            $('#menor_cpf').val(),
            $('#destino').val(),
            $('#data_inicio').val(),
            $('#data_fim').val(),
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
        const responsavelNome = $('#responsavel_nome').val();
        const responsavelRG = $('#responsavel_rg').val();
        const responsavelCPF = $('#responsavel_cpf').val();
        const endereco = $('#endereco').val();
        const numero = $('#numero').val();
        const bairro = $('#bairro').val();
        const cidade = $('#cidade').val();
        const estado = $('#estado').val();
        const menorNome = $('#menor_nome').val();
        const menorCPF = $('#menor_cpf').val();
        const destino = $('#destino').val();
        const dataInicio = formatarData($('#data_inicio').val()); // Usando a função de formatação de data
        const dataFim = formatarData($('#data_fim').val()); // Usando a função de formatação de data

        // Configurações gerais
        const margemEsquerda = 10; // Margem esquerda do documento
        const larguraTexto = 190; // Largura máxima do texto (A4 = 210mm - margens)
        let y = 40; // Posição inicial no eixo Y

        doc.setFontSize(12);

        // Título do documento
        doc.text('AUTORIZAÇÃO DE VIAGEM DESACOMPANHADO', 105, 20, null, null, 'center');

        // Corpo do documento com o texto justificado
        const textoCorpo = `Eu, ${responsavelNome}, portador(a) do RG nº ${responsavelRG} e CPF nº ${responsavelCPF}, residente e domiciliado(a) na rua/av. ${endereco}, nº ${numero}, bairro ${bairro}, cidade ${cidade} - ${estado}, autorizo meu filho(a) ${menorNome}, portador(a) do CPF nº ${menorCPF}, a viajar para ${destino}, no período de ${dataInicio} a ${dataFim}.`;

        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8; // Ajustando a altura para o próximo bloco de texto

        // Declaração adicional
        const textoAdicional = 'Declaro, ainda, que as informações acima são verdadeiras e que estou ciente de que a falsidade dessa declaração pode implicar em sanções penais e civis.';
        const linhasAdicional = doc.splitTextToSize(textoAdicional, larguraTexto);
        doc.text(linhasAdicional, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasAdicional.length * 8; // Ajustando a altura para o próximo bloco de texto

        // Local e Data
        doc.text(`Local e data: ________________, ____, ${dataInicio}, 202_.`, margemEsquerda, y);
        y += 20;

        // Assinatura
        doc.text('Assinatura do Responsável:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('autorizacao_viagem_menor.pdf');
    });
});
