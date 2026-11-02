// Dados dos heróis compartilhados entre as telas (Ecos durante a partida, ficha completa ao salvar).
// Protótipo: o catálogo fica aqui; no app real vem da base do jogo.
const HEROIS = (() => {
    const ATTRS = [['aggressiveness', 'AGR', 'agression'], ['empathy', 'EMP', 'empathy'], ['courage', 'COR', 'courage'], ['caution', 'CAU', 'caution'], ['practicality', 'PRA', 'practicality'], ['spirituality', 'ESP', 'spirituality']];
    const SKILLS = { gerdwyn: { aggressiveness: ['Magistral', 'Linha de Frente', 'Foco', 'Sono Pesado'], empathy: ['Alívio de Tensão', 'Aprendizado Acelerado', 'Caçadora de Recompensas', 'Líder Nata'], courage: ['Domínio do Escudo', 'Caçadora', 'Reconhecimento', 'Protetora'], caution: ['Donzela Escudeira', 'Presença', 'Fortalecer', 'Bem Preparada'], practicality: ['Contratática', 'Audácia', 'Pechinchar', 'Saque Rápido'], spirituality: ['Disparo a Esmo', 'Esperança Exemplar', 'Pressentimento', 'Suprimentos Mágicos'] } };
    const ECHOES = {
        elgan: { cards: [310, 311, 312], mem: [['Fim do dia', 'Todos os Locais em jogo estão com o lado de exploração virado para cima.'], ['Durante o dia', 'Viaje para o Local 122 (Passarelas Inundadas).'], ['Durante o dia', "Realize a ação 'Ativar um Marco' em um Local que já possui um marco ativado."], ['Sempre', 'Tenha pelo menos 8 de Magia no seu inventário.'], ['Diplomacia', 'Resolva um Encontro azul (dificuldade 3 ou 4).'], ['Encontro', 'Tenha pelo menos 3 chaves ou símbolos mágicos na sequência.'], ['Combate', 'Tenha pelo menos 4 cartas na sequência de combate.'], ['Fim do dia', 'Sofra de Estranhice no Local 113, 114 ou 115.'], ['Durante o dia', "Use 2 itens consumíveis 'Vela Estranya' durante um único dia."]], final: ['Poder superior', 'No Local 111: procure por um grimório mágico.'] },
        gerdwyn: { cards: [314, 315, 316], mem: [['Sempre', 'Tenha pelo menos 10 de Riqueza no seu inventário.'], ['Durante o dia', 'Você está no Local 125 (Terras do Sul).'], ['Durante o dia', 'Perca 2 de Energia num único dia devido à sua Fraqueza de Personagem.'], ['Diplomacia', "Resolva um Encontro enquanto sofre do status 'Enlouquecendo'."], ['Sempre', 'Tenha pelo menos nível 4 em qualquer atributo.'], ['Combate', 'Vença um Encontro roxo usando sua habilidade de personagem.'], ['Sempre', "Tenha pelo menos 2 itens com a palavra-chave 'Escudo'."], ['Combate', "Vença o Encontro roxo 'Cavaleiro da Távola Oval'."], ['Combate', 'Vença um Encontro sem cartas restantes no baralho de compra.']], final: ['A chama de ontem', 'No Local 135: procure por seu antigo camarada, Owen.'] },
        iunis: { cards: [318, 319, 320], mem: [['Combate', 'Vença um Encontro com exatamente 1 de Saúde restante.'], ['Diplomacia', "Resolva um Encontro enquanto sofre do status 'Enlouquecendo'."], ['Sempre', 'Tenha pelo menos 8 de Comida no seu inventário.'], ['Encontro', 'Perca 4 ou mais atributos por efeitos de carta em uma única ativação.'], ['Encontro', 'Jogue 5 ou mais cartas durante uma única ativação.'], ['Durante o dia', 'Viaje para o Local 150 (Caminho dos Escravos).'], ['Durante o dia', 'Use sua habilidade de personagem enquanto estiver exausta.'], ['Sempre', 'Tenha 3 marcos ativos na mesa.'], ['Exploração', 'Use o transporte costeiro fomoriano no Local 151, 156 ou 160.']], final: ['A grande performance', 'No Local 156: encomende e realize uma peça teatral (pague 3 Riquezas).'] },
        osbert: { cards: [322, 323, 324], mem: [['Combate', 'Vença um Encontro verde.'], ['Sempre', 'Tenha uma carta de Companheiro.'], ['Sempre', 'Role um 6 natural em um dado de 6 faces.'], ['Sempre', 'Tenha pelo menos 10 de Riqueza.'], ['Durante o dia', 'Viaje para um Local com 0 ou 1 de Energia.'], ['Encontro', 'Ganhe a recompensa bônus máxima listada no card do inimigo.'], ['Sempre', 'Tenha os 3 itens consumíveis da sua habilidade de personagem.'], ['Durante o dia', 'Viaje para o Local 134 (Fazendas Pacíficas).'], ['Diplomacia', 'Resolva um Encontro azul em um Local que possui um marco.']], final: ['O filho pródigo', 'No Local 101: viaje para a vila que exilou sua mãe.'] }
    };
    const deckB = () => Array.from({ length: 10 }, (_, i) => 'B' + (i + 1));
    const newHero = (id, name, title, player, loc, tracks, attrs) => ({ id, name, title, player, loc, tracks, res: { food: 0, wealth: 0, exp: 0, magic: 0 }, attrs, skills: Object.fromEntries(ATTRS.map(a => [a[0], ['', '']])), decks: { combat: deckB(), diplomacy: deckB() }, items: [], secrets: [], echoes: { marks: Array(9).fill(false), spent: [false, false, false] } });
    function seed() {
        const list = [
            newHero('elgan', 'Elgan', 'o Candelário', 'Dener', '115', { health: 12, energy: 6, terror: 0 }, { aggressiveness: 1, empathy: 1, courage: 0, caution: 1, practicality: 2, spirituality: 1 }),
            newHero('gerdwyn', 'Gerdwyn', 'a Mercenária', 'Mariana', '', { health: 14, energy: 5, terror: 0 }, { aggressiveness: 2, empathy: 0, courage: 2, caution: 1, practicality: 1, spirituality: 0 }),
            newHero('iunis', 'Iunis', 'a Gladiatrix Fomoriana', '', '', { health: 11, energy: 7, terror: 0 }, { aggressiveness: 0, empathy: 2, courage: 0, caution: 2, practicality: 1, spirituality: 2 }),
            newHero('osbert', 'Osbert', 'o Bufão Itinerante', '', '', { health: 13, energy: 6, terror: 0 }, { aggressiveness: 1, empathy: 1, courage: 1, caution: 0, practicality: 2, spirituality: 1 })
        ];
        list[0].items = [{ id: 'i1', name: 'Lanterna Encantada', equipped: true, spent: false }, { id: 'i2', name: 'Poção de Cura', equipped: false, spent: true }];
        list[0].secrets = [{ id: 's1', num: '48', desc: 'Conflitos reforçados' }];
        list[0].echoes.marks = [true, true, true, true, false, false, false, false, false];
        KR.set('heroes', list);
        return list;
    }
    const load = () => KR.get('heroes', null) || seed();
    const save = list => KR.set('heroes', list);
    return { ATTRS, SKILLS, ECHOES, load, save };
})();
