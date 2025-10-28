import mongoose from "mongoose";
import { config } from "../config";
import { Category } from "../modules/category/CategoryModel";
import { Product } from "../modules/product/ProductModel";

export async function createProductsAndCategoriesSeed() {
	try {
		await Product.deleteMany({});
		await Category.deleteMany({});

		const uniqueCategoriesMap = new Map(
			PRODUCTS_LIST.map((product) => [product.category.slug, product.category]),
		);

		const createdCategories = await Category.insertMany(
			Array.from(uniqueCategoriesMap.values()),
		);

		const categoryIdLookup = new Map(
			createdCategories.map((cat) => [cat.slug, cat._id]),
		);

		const productsToCreate = PRODUCTS_LIST.map((product) => {
			const { category, ...restOfProduct } = product;

			return {
				...restOfProduct,
				category: categoryIdLookup.get(category.slug),
			};
		});

		await Product.insertMany(productsToCreate);
	} catch (error) {
		console.error("Error creating products and categories seed:", error);
	}
}

async function runSeed() {
	try {
		await mongoose.connect(config.MONGO_URI, {
			dbName: config.DB_NAME,
		});
		console.info("🔌 Conectado ao MongoDB.");

		await createProductsAndCategoriesSeed();
	} catch (error) {
		console.error("🔥 Falha ao conectar ou executar o seed:", error);
	} finally {
		await mongoose.disconnect();
		console.info("🔌 Desconectado do MongoDB.");
		process.exit(0);
	}
}

runSeed();

export const PRODUCTS_LIST = [
	{
		name: "Camiseta Gráfica Majestosa Montanha",
		slug: "majestic-mountain-graphic-t-shirt",
		price: 44,
		description:
			"Eleve seu guarda-roupa com esta elegante camiseta preta com um impressionante gráfico monocromático de cordilheiras. Perfeita para quem ama o ar livre ou quer adicionar um toque de design inspirado na natureza ao seu visual, esta camiseta é feita de tecido macio e respirável, garantindo conforto o dia todo. Ideal para passeios casuais ou como um presente único, esta camiseta é uma adição versátil a qualquer coleção.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/QkIa5tT.jpeg",
			"https://i.imgur.com/jb5Yu0h.jpeg",
			"https://i.imgur.com/UlxxXyG.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Moletom Clássico Vermelho com Capuz",
		slug: "classic-red-pullover-hoodie",
		price: 10,
		description:
			"Eleve seu guarda-roupa casual com nosso Moletom Clássico Vermelho com Capuz. Feito com uma mistura de algodão macio para o máximo conforto, este moletom vermelho vibrante possui um bolso canguru, capuz com cordão ajustável e punhos canelados para um ajuste confortável. O design atemporal garante fácil combinação com jeans ou joggers para um visual descontraído e elegante, tornando-o uma adição versátil ao seu traje diário.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/1twoaDy.jpeg",
			"https://i.imgur.com/FDwQgLy.jpeg",
			"https://i.imgur.com/kg1ZhhH.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Moletom Clássico Cinza Mescla com Capuz",
		slug: "classic-heather-gray-hoodie",
		price: 69,
		description:
			"Fique aconchegante e estiloso com nosso Moletom Clássico Cinza Mescla com Capuz. Feito de tecido macio e durável, possui bolso canguru, capuz com cordão ajustável e punhos canelados. Perfeito para um dia casual ou uma noite relaxante em casa, este moletom é uma adição versátil a qualquer guarda-roupa.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/cHddUCu.jpeg",
			"https://i.imgur.com/CFOjAgK.jpeg",
			"https://i.imgur.com/wbIMMme.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Moletom Clássico Cinza com Capuz",
		slug: "classic-grey-hooded-sweatshirt",
		price: 90,
		description:
			"Eleve seu visual casual com nosso Moletom Clássico Cinza com Capuz. Feito de uma mistura de algodão macio, este moletom possui um bolso canguru frontal, um capuz com cordão ajustável e punhos canelados para um ajuste confortável. Perfeito para aquelas noites frias ou fins de semana preguiçosos, combina sem esforço com seus jeans ou joggers favoritos.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/R2PN9Wq.jpeg",
			"https://i.imgur.com/IvxMPFr.jpeg",
			"https://i.imgur.com/7eW9nXP.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Moletom Clássico Preto com Capuz",
		slug: "classic-black-hooded-sweatshirt",
		price: 79,
		description:
			"Eleve seu guarda-roupa casual com nosso Moletom Clássico Preto com Capuz. Feito de tecido macio e de alta qualidade que garante conforto e durabilidade, este moletom possui um espaçoso bolso canguru e um capuz com cordão ajustável. Seu design versátil o torna perfeito para um dia relaxado em casa ou um passeio casual.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/cSytoSD.jpeg",
			"https://i.imgur.com/WwKucXb.jpeg",
			"https://i.imgur.com/cE2Dxh9.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Calça Jogger Clássica de Ajuste Confortável",
		slug: "classic-comfort-fit-joggers",
		price: 25,
		description:
			"Descubra a combinação perfeita de estilo e conforto com nossa Calça Jogger Clássica de Ajuste Confortável. Esta versátil calça jogger preta possui um cós elástico macio com cordão ajustável, dois bolsos laterais e punhos canelados no tornozelo para um ajuste seguro. Feita de um tecido leve e durável, é ideal tanto para dias ativos quanto para relaxar.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/ZKGofuB.jpeg",
			"https://i.imgur.com/GJi73H0.jpeg",
			"https://i.imgur.com/633Fqrz.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Calça Jogger Clássica Confortável com Cordão",
		slug: "classic-comfort-drawstring-joggers",
		price: 79,
		description:
			"Experimente a combinação perfeita de conforto e estilo com nossa Calça Jogger Clássica Confortável com Cordão. Projetada para um ajuste relaxado, esta calça jogger apresenta um tecido macio e elástico, bolsos laterais convenientes e um cós com cordão ajustável com elegantes detalhes dourados na ponta. Ideal para relaxar ou fazer tarefas, esta calça rapidamente se tornará sua escolha para um visual casual e sem esforço.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/mp3rUty.jpeg",
			"https://i.imgur.com/JQRGIc2.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Calça de Moletom Jogger Clássica Vermelha",
		slug: "classic-red-jogger-sweatpants",
		price: 98,
		description:
			"Experimente o máximo conforto com nossa calça de moletom jogger vermelha, perfeita tanto para sessões de treino quanto para relaxar em casa. Feita com tecido macio e durável, esta calça jogger possui um cós justo, cordão ajustável e bolsos laterais práticos para funcionalidade. Seu design afunilado e punhos elásticos oferecem um ajuste moderno que mantém você estiloso em movimento.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/9LFjwpI.jpeg",
			"https://i.imgur.com/vzrTgUR.jpeg",
			"https://i.imgur.com/p5NdI6n.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Boné de Beisebol Clássico Azul Marinho",
		slug: "classic-navy-blue-baseball-cap",
		price: 61,
		description:
			"Saia com estilo com este elegante boné de beisebol azul marinho. Feito de material durável, apresenta um design suave e estruturado e uma tira ajustável para o ajuste perfeito. Proteja seus olhos do sol e complemente seus looks casuais com este acessório versátil e atemporal.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/R3iobJA.jpeg",
			"https://i.imgur.com/Wv2KTsf.jpeg",
			"https://i.imgur.com/76HAxcA.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Boné de Beisebol Clássico Azul",
		slug: "classic-blue-baseball-cap",
		price: 86,
		description:
			"Complete seu visual casual com nosso Boné de Beisebol Clássico Azul, feito de materiais de alta qualidade para um conforto duradouro. Apresentando um design atemporal de seis painéis com uma viseira pré-curvada, este boné ajustável oferece estilo e praticidade para o uso diário.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/wXuQ7bm.jpeg",
			"https://i.imgur.com/BZrIEmb.jpeg",
			"https://i.imgur.com/KcT6BE0.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Boné de Beisebol Clássico Vermelho",
		slug: "classic-red-baseball-cap",
		price: 35,
		description:
			"Eleve seu guarda-roupa casual com este atemporal boné de beisebol vermelho. Feito de tecido durável, possui um ajuste confortável com uma tira ajustável na parte de trás, garantindo que sirva para todos. Perfeito para dias ensolarados ou para adicionar um toque esportivo ao seu visual.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/cBuLvBi.jpeg",
			"https://i.imgur.com/N1GkCIR.jpeg",
			"https://i.imgur.com/kKc9A5p.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Boné de Beisebol Clássico Preto",
		slug: "classic-black-baseball-cap",
		price: 58,
		description:
			"Eleve seu visual casual com este atemporal boné de beisebol preto. Feito com tecido respirável de alta qualidade, possui uma tira ajustável para o ajuste perfeito. Seja para uma corrida ou apenas para fazer tarefas, este boné adiciona um toque de estilo a qualquer roupa.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/KeqG6r4.jpeg",
			"https://i.imgur.com/xGQOw3p.jpeg",
			"https://i.imgur.com/oO5OUjb.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Shorts Chino Clássicos Verde Oliva",
		slug: "classic-olive-chino-shorts",
		price: 84,
		description:
			"Eleve seu guarda-roupa casual com estes shorts chino clássicos verde oliva. Projetados para conforto e versatilidade, eles featurem um cós liso, bolsos práticos e um ajuste sob medida que os torna perfeitos tanto para fins de semana relaxados quanto para ocasiões smart-casual. O tecido durável garante que eles resistam às suas atividades diárias, mantendo um visual elegante.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/UsFIvYs.jpeg",
			"https://i.imgur.com/YIq57b6.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Shorts Atléticos Clássicos de Cintura Alta",
		slug: "classic-high-waisted-athletic-shorts",
		price: 43,
		description:
			"Mantenha-se confortável e estilosa com nossos Shorts Atléticos Clássicos de Cintura Alta. Projetados para movimento ideal e versatilidade, estes shorts são indispensáveis para o seu guarda-roupa de treino. Com uma cintura alta que valoriza a silhueta, tecido respirável e um ajuste seguro que garante que fiquem no lugar durante qualquer atividade, estes shorts são perfeitos para a academia, corrida ou até mesmo para uso casual.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/eGOUveI.jpeg",
			"https://i.imgur.com/UcsGO7E.jpeg",
			"https://i.imgur.com/NLn4e7S.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Camiseta Clássica Branca de Gola Redonda",
		slug: "classic-white-crew-neck-t-shirt",
		price: 39,
		description:
			"Eleve seus itens básicos com esta versátil camiseta branca de gola redonda. Feita de uma mistura de algodão macia e respirável, oferece conforto e durabilidade. Seu design elegante e atemporal garante que combine bem com praticamente qualquer roupa. Ideal para usar em camadas ou sozinha, esta camiseta é um item básico indispensável para todo guarda-roupa.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/axsyGpD.jpeg",
			"https://i.imgur.com/T8oq9X2.jpeg",
			"https://i.imgur.com/J6MinJn.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Camiseta Branca Clássica - Estilo Atemporal e Conforto",
		slug: "classic-white-tee-timeless-style-and-comfort",
		price: 73,
		description:
			"Eleve seu guarda-roupa diário com nossa Camiseta Branca Clássica. Feita de material de algodão macio premium, esta camiseta versátil combina conforto com durabilidade, perfeita para o uso diário. Com um ajuste relaxado e unissex que valoriza todos os tipos de corpo, é uma peça fundamental para qualquer conjunto casual. Fácil de cuidar e lavável na máquina, esta camiseta branca mantém sua forma e maciez lavagem após lavagem. Combine com seus jeans favoritos ou use sob uma jaqueta para um visual elegante.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/Y54Bt8J.jpeg",
			"https://i.imgur.com/SZPDSgy.jpeg",
			"https://i.imgur.com/sJv4Xx0.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Camiseta Clássica Preta",
		slug: "classic-black-t-shirt",
		price: 35,
		description:
			"Eleve seu estilo diário com nossa Camiseta Clássica Preta. Esta peça fundamental é feita de algodão macio e respirável para conforto o dia todo. Seu design versátil apresenta uma gola redonda clássica e mangas curtas, tornando-a perfeita para usar em camadas ou sozinha. Durável e fácil de cuidar, com certeza se tornará uma favorita em seu guarda-roupa.",
		category: {
			name: "Roupas",
			slug: "roupas",
			image: "https://i.imgur.com/QkIa5tT.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/9DqEOV5.jpeg",
			"https://i.imgur.com/ae0AEYn.jpeg",
			"https://i.imgur.com/mZ4rUjj.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Controle de Jogo Sem Fio Elegante Branco e Laranja",
		slug: "sleek-white-orange-wireless-gaming-controller",
		price: 69,
		description:
			"Eleve sua experiência de jogo com este controle sem fio de última geração, apresentando uma base branca nítida com vibrantes detalhes em laranja. Projetado para jogos de precisão, o formato ergonômico e os botões responsivos proporcionam máximo conforto e controle para horas intermináveis de jogo. Compatível com várias plataformas de jogos, este controle é indispensável para qualquer jogador sério que queira aprimorar seu setup.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/ZANVnHE.jpeg",
			"https://i.imgur.com/Ro5z6Tn.jpeg",
			"https://i.imgur.com/woA93Li.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Conjunto Elegante de Fone de Ouvido Sem Fio e Fone Intra-auricular",
		slug: "sleek-wireless-headphone-inked-earbud-set",
		price: 44,
		description:
			"Experimente a fusão de estilo e som com este sofisticado conjunto de áudio, apresentando um par de elegantes fones de ouvido sem fio brancos que oferecem qualidade de som cristalina e conforto sobre a orelha. O conjunto também inclui um par de fones intra-auriculares duráveis, perfeitos para um estilo de vida em movimento. Eleve seu prazer musical com esta dupla versátil, projetada para atender a todas as suas necessidades auditivas.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/yVeIeDa.jpeg",
			"https://i.imgur.com/jByJ4ih.jpeg",
			"https://i.imgur.com/KXj6Tpb.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Fones de Ouvido Over-Ear Elegantes de Ajuste Confortável",
		slug: "sleek-comfort-fit-over-ear-headphones",
		price: 28,
		description:
			"Experimente qualidade de som superior com nossos Fones de Ouvido Over-Ear Elegantes de Ajuste Confortável, projetados para uso prolongado com conchas auriculares acolchoadas e uma faixa de cabeça ajustável e acolchoada. Ideal para audição imersiva, seja em casa, no escritório ou em trânsito. Sua construção durável e design atemporal proporcionam tanto uma aparência esteticamente agradável quanto um desempenho duradouro.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/SolkFEB.jpeg",
			"https://i.imgur.com/KIGW49u.jpeg",
			"https://i.imgur.com/mWwek7p.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Torradeira Eficiente de 2 Fatias",
		slug: "efficient-2-slice-toaster",
		price: 48,
		description:
			"Aprimore sua rotina matinal com nossa elegante torradeira de 2 fatias, com controles de tostagem ajustáveis e uma bandeja de migalhas removível para fácil limpeza. Este aparelho compacto e estiloso é perfeito para qualquer cozinha, garantindo que sua torrada esteja sempre dourada e deliciosa.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/keVCVIa.jpeg",
			"https://i.imgur.com/afHY7v2.jpeg",
			"https://i.imgur.com/yAOihUe.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Mouse de Computador Sem Fio Elegante",
		slug: "sleek-wireless-computer-mouse",
		price: 10,
		description:
			"Experimente navegação suave e precisa com este moderno mouse sem fio, apresentando um acabamento brilhante e um design ergonômico confortável. Seu rastreamento responsivo e interface fácil de usar o tornam o acessório perfeito para qualquer configuração de desktop ou laptop. O tom azul estiloso adiciona um toque de cor ao seu espaço de trabalho, enquanto seu tamanho compacto garante que ele caiba perfeitamente em sua bolsa para produtividade em movimento.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/w3Y8NwQ.jpeg",
			"https://i.imgur.com/WJFOGIC.jpeg",
			"https://i.imgur.com/dV4Nklf.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Laptop Moderno Elegante com Iluminação Ambiente",
		slug: "sleek-modern-laptop-with-ambient-lighting",
		price: 43,
		description:
			"Experimente a computação de próximo nível com nosso laptop ultrafino, apresentando uma tela deslumbrante iluminada por luz ambiente. Esta máquina de alto desempenho é perfeita tanto para trabalho quanto para lazer, oferecendo processamento poderoso em um design elegante e portátil. As cores vibrantes adicionam um toque de personalidade à sua coleção de tecnologia, tornando-o tão estiloso quanto funcional.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/OKn1KFI.jpeg",
			"https://i.imgur.com/G4f21Ai.jpeg",
			"https://i.imgur.com/Z9oKRVJ.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Laptop Moderno Elegante para Profissionais",
		slug: "sleek-modern-laptop-for-professionals",
		price: 97,
		description:
			"Experimente tecnologia de ponta e design elegante com nosso mais recente modelo de laptop. Perfeito para profissionais em movimento, este laptop de alto desempenho possui um processador poderoso, amplo armazenamento e bateria de longa duração, tudo envolto em uma estrutura leve e fina para portabilidade máxima. Compre agora para elevar seu trabalho e lazer.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/ItHcq7o.jpeg",
			"https://i.imgur.com/55GM3XZ.jpeg",
			"https://i.imgur.com/tcNJxoW.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Fones de Ouvido Over-Ear Elegantes Vermelhos e Prateados",
		slug: "stylish-red-silver-over-ear-headphones",
		price: 39,
		description:
			"Mergulhe em qualidade de som superior com estes elegantes fones de ouvido over-ear vermelhos e prateados. Projetados para conforto e estilo, os fones de ouvido apresentam conchas auriculares acolchoadas, uma faixa de cabeça acolchoada ajustável e um cabo vermelho destacável para fácil armazenamento e portabilidade. Perfeito para amantes de música e audiófilos que valorizam tanto a aparência quanto a fidelidade de áudio.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/YaSqa06.jpeg",
			"https://i.imgur.com/isQAliJ.jpeg",
			"https://i.imgur.com/5B8UQfh.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Capa de Celular Elegante com Acabamento Espelhado",
		slug: "sleek-mirror-finish-phone-case",
		price: 27,
		description:
			"Aprimore a aparência do seu smartphone com esta capa de celular ultrafina com acabamento espelhado. Projetada para oferecer estilo com proteção, a capa apresenta uma superfície reflexiva que adiciona um toque de elegância enquanto mantém seu dispositivo seguro contra arranhões e impactos. Perfeita para quem ama uma estética minimalista e moderna.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/yb9UQKL.jpeg",
			"https://i.imgur.com/m2owtQG.jpeg",
			"https://i.imgur.com/bNiORct.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Smartwatch Elegante com Tela Vibrante",
		slug: "sleek-smartwatch-with-vibrant-display",
		price: 16,
		description:
			"Experimente a cronometragem moderna com nosso smartwatch de alta tecnologia, apresentando uma tela de toque vívida, mostradores de relógio personalizáveis e uma confortável pulseira de silicone azul. Este smartwatch mantém você conectado com notificações e rastreamento de fitness, ao mesmo tempo em que exibe estilo e versatilidade excepcionais.",
		category: {
			name: "Eletrônicos",
			slug: "eletronicos",
			image: "https://i.imgur.com/ZANVnHE.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/LGk9Jn2.jpeg",
			"https://i.imgur.com/1ttYWaI.jpeg",
			"https://i.imgur.com/sPRWnJH.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Sofá de Couro Moderno Elegante",
		slug: "sleek-modern-leather-sofa",
		price: 53,
		description:
			"Aumente a elegância do seu espaço de vida com nosso Sofá de Couro Moderno Elegante. Projetado com uma estética minimalista, apresenta linhas limpas e um luxuoso acabamento em couro. As robustas pernas de metal fornecem estabilidade e suporte, enquanto as almofadas macias garantem conforto. Perfeito para casas contemporâneas ou áreas de espera de escritório, este sofá é uma peça de destaque que combina estilo com praticidade.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/Qphac99.jpeg",
			"https://i.imgur.com/dJjpEgG.jpeg",
			"https://i.imgur.com/MxJyADq.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Mesa de Jantar de Madeira Moderna de Meados do Século",
		slug: "mid-century-modern-wooden-dining-table",
		price: 24,
		description:
			"Eleve sua sala de jantar com esta elegante mesa de jantar moderna de meados do século, apresentando um elegante acabamento em nogueira e pernas cônicas para uma estética atemporal. Sua construção robusta em madeira e design minimalista a tornam uma peça versátil que se encaixa em uma variedade de estilos de decoração. Perfeita para jantares íntimos ou como um local estiloso para seu café da manhã.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/DMQHGA0.jpeg",
			"https://i.imgur.com/qrs9QBg.jpeg",
			"https://i.imgur.com/XVp8T1I.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Mesa de Jantar Elegante com Base Dourada e Tampo de Pedra",
		slug: "elegant-golden-base-stone-top-dining-table",
		price: 66,
		description:
			"Eleve seu espaço de jantar com esta mesa luxuosa, apresentando uma base de metal dourada resistente com um intrincado design de hastes que oferece estabilidade e elegância chique. O tampo de pedra liso em formato redondo elegante oferece uma superfície robusta para seu prazer gastronômico. Perfeita tanto para refeições diárias quanto para ocasiões especiais, esta mesa complementa facilmente qualquer decoração moderna ou glamorosa.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/NWIJKUj.jpeg",
			"https://i.imgur.com/Jn1YSLk.jpeg",
			"https://i.imgur.com/VNZRvx5.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Poltrona Elegante Moderna Verde-azulado",
		slug: "modern-elegance-teal-armchair",
		price: 25,
		description:
			"Eleve seu espaço de vida com esta poltrona lindamente trabalhada, apresentando uma elegante estrutura de madeira que complementa seu vibrante estofamento verde-azulado. Ideal para adicionar um toque de cor e estilo contemporâneo a qualquer cômodo, esta cadeira oferece conforto soberbo e design sofisticado. Perfeita para ler, relaxar ou criar um canto de conversa aconchegante.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/6wkyyIN.jpeg",
			"https://i.imgur.com/Ald3Rec.jpeg",
			"https://i.imgur.com/dIqo03c.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Mesa de Jantar Elegante de Madeira Maciça",
		slug: "elegant-solid-wood-dining-table",
		price: 67,
		description:
			"Aprimore seu espaço de jantar com esta mesa de jantar elegante e contemporânea, feita de madeira maciça de alta qualidade com acabamento quente. Sua construção robusta e design minimalista a tornam uma adição perfeita para qualquer casa que procura um toque de elegância. Acomoda até seis pessoas confortavelmente e inclui uma fruteira marcante como peça central. A iluminação suspensa não está incluída.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/4lTaHfF.jpeg",
			"https://i.imgur.com/JktHE1C.jpeg",
			"https://i.imgur.com/cQeXQMi.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Configuração de Estação de Trabalho Minimalista Moderna",
		slug: "modern-minimalist-workstation-setup",
		price: 49,
		description:
			"Eleve seu escritório em casa com nossa Configuração de Estação de Trabalho Minimalista Moderna, apresentando uma elegante mesa de madeira com um computador elegante, luminária de mesa de madeira ajustável e estilosa, e acessórios complementares para um espaço de trabalho limpo e produtivo. Esta configuração é perfeita para profissionais que buscam um visual contemporâneo que combina funcionalidade com design.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/3oXNBst.jpeg",
			"https://i.imgur.com/ErYYZnT.jpeg",
			"https://i.imgur.com/boBPwYW.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Cadeira de Escritório Ergonômica Moderna",
		slug: "modern-ergonomic-office-chair",
		price: 71,
		description:
			"Eleve seu espaço de escritório com esta Cadeira de Escritório Ergonômica Moderna, elegante e confortável. Projetada para fornecer suporte ideal durante todo o dia de trabalho, possui mecanismo de ajuste de altura, rodízios de rolamento suave para fácil mobilidade e assento acolchoado para conforto prolongado. As linhas limpas e o design minimalista branco a tornam uma adição versátil a qualquer espaço de trabalho contemporâneo.",
		category: {
			name: "Moveis",
			slug: "moveis",
			image: "https://i.imgur.com/Qphac99.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/3dU0m72.jpeg",
			"https://i.imgur.com/zPU3EVa.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Chuteiras de Futebol Holográficas Futuristas",
		slug: "futuristic-holographic-soccer-cleats",
		price: 39,
		description:
			"Entre em campo e destaque-se da multidão com estas atraentes chuteiras de futebol holográficas. Projetadas para o jogador moderno, estas chuteiras apresentam uma silhueta elegante, construção leve para máxima agilidade e travas duráveis para tração ideal. O acabamento holográfico brilhante reflete um arco-íris de cores conforme você se move, garantindo que você seja notado tanto por suas habilidades quanto por seu estilo. Perfeita para o atleta antenado na moda que quer fazer uma declaração.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/qNOjJje.jpeg",
			"https://i.imgur.com/NjfCFnu.jpeg",
			"https://i.imgur.com/eYtvXS1.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Sapatos de Salto Alto com Glitter Arco-Íris",
		slug: "rainbow-glitter-high-heels",
		price: 39,
		description:
			"Entre no centro das atenções com estes atraentes sapatos de salto alto com glitter arco-íris. Projetados para deslumbrar, cada sapato ostenta um caleidoscópio de cores brilhantes que capturam e refletem a luz a cada passo. Perfeitos para ocasiões especiais ou uma noite fora, estes deslumbrantes com certeza atrairão olhares e elevarão qualquer conjunto.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/62gGzeF.jpeg",
			"https://i.imgur.com/5MoPuFM.jpeg",
			"https://i.imgur.com/sUVj7pK.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Sandálias Espadrille Jeans Chiques de Verão",
		slug: "chic-summer-denim-espadrille-sandals",
		price: 33,
		description:
			"Entre no verão com estilo com nossas sandálias espadrille jeans. Apresentando uma sola de juta trançada para um toque clássico e tiras de jeans ajustáveis para um ajuste confortável, estas sandálias oferecem conforto e um toque moderno. O design fácil de calçar garante conveniência para dias de praia ou passeios casuais.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/9qrmE1b.jpeg",
			"https://i.imgur.com/wqKxBVH.jpeg",
			"https://i.imgur.com/sWSV6DK.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Corredores Vibrantes: Tênis Ousados Laranja e Azul",
		slug: "vibrant-runners-bold-orange-blue-sneakers",
		price: 27,
		description:
			"Entre no estilo com estes tênis atraentes, apresentando uma combinação marcante de tons laranja e azul. Projetados tanto para conforto quanto para moda, estes sapatos vêm com solas flexíveis e palmilhas acolchoadas, perfeitos para indivíduos ativos que não abrem mão do estilo. Os detalhes prateados reflexivos adicionam um toque de modernidade, tornando-os um acessório de destaque para seu treino ou uso casual.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/hKcMNJs.jpeg",
			"https://i.imgur.com/NYToymX.jpeg",
			"https://i.imgur.com/HiiapCt.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Tênis Clássicos Rosa Vibrante",
		slug: "vibrant-pink-classic-sneakers",
		price: 84,
		description:
			"Entre no estilo com nossos Tênis Clássicos Rosa Vibrante! Estes sapatos atraentes apresentam um tom rosa ousado com detalhes icônicos em branco, oferecendo um design elegante e atemporal. Construídos com materiais duráveis e um ajuste confortável, são perfeitos para quem busca um toque de cor em seu calçado diário. Garanta um par hoje e adicione um pouco de vibração ao seu passo!",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/mcW42Gi.jpeg",
			"https://i.imgur.com/mhn7qsF.jpeg",
			"https://i.imgur.com/F8vhnFJ.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Tênis de Cano Alto Futurista Prata e Dourado",
		slug: "futuristic-silver-and-gold-high-top-sneaker",
		price: 68,
		description:
			"Entre no futuro com este atraente tênis de cano alto, projetado para aqueles que ousam se destacar. O tênis apresenta um corpo prateado elegante com detalhes dourados marcantes, oferecendo um toque moderno ao calçado clássico. Seu design de cano alto oferece suporte e estilo, tornando-o a adição perfeita a qualquer coleção de moda vanguardista. Garanta um par hoje e eleve seu jogo de calçados!",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/npLfCGq.jpeg",
			"https://i.imgur.com/vYim3gj.jpeg",
			"https://i.imgur.com/HxuHwBO.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Botas de Salto Alto Chiques Futuristas",
		slug: "futuristic-chic-high-heel-boots",
		price: 36,
		description:
			"Eleve seu estilo com nossas botas de salto alto de vanguarda que misturam design ousado com estética avant-garde. Estas botas apresentam um salto bloco com cores únicas, uma silhueta elegante e um acabamento cinza claro versátil que combina facilmente com qualquer roupa de ponta. Feitas para o indivíduo antenado na moda, estas botas com certeza farão uma declaração.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/HqYqLnW.jpeg",
			"https://i.imgur.com/RlDGnZw.jpeg",
			"https://i.imgur.com/qa0O6fg.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Scarpins Peep-Toe Elegantes de Couro Envernizado com Salto Dourado",
		slug: "elegant-patent-leather-peep-toe-pumps",
		price: 53,
		description:
			"Entre na sofisticação com estes chiques scarpins peep-toe, apresentando um acabamento lustroso de couro envernizado e um atraente salto bloco dourado. O detalhe da fivela ornamentada adiciona um toque de glamour, perfeito para elevar seu traje de noite ou complementar um visual diurno polido.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/AzAY4Ed.jpeg",
			"https://i.imgur.com/umfnS9P.jpeg",
			"https://i.imgur.com/uFyuvLg.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Mocassins de Couro Roxo Elegantes",
		slug: "elegant-purple-leather-loafers",
		price: 17,
		description:
			"Entre na sofisticação com nossos Mocassins de Couro Roxo Elegantes, perfeitos para fazer uma declaração ousada. Feitos de couro de alta qualidade com um acabamento roxo vibrante, estes sapatos apresentam uma silhueta clássica de mocassim que foi atualizada com um toque contemporâneo. O design confortável slip-on e as solas duráveis garantem estilo e funcionalidade para o homem moderno.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/Au8J9sX.jpeg",
			"https://i.imgur.com/gdr8BW2.jpeg",
			"https://i.imgur.com/KDCZxnJ.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
	{
		name: "Sapatos Casuais Clássicos de Camurça Azul",
		slug: "classic-blue-suede-casual-shoes",
		price: 39,
		description:
			"Entre no conforto com nossos Sapatos Casuais Clássicos de Camurça Azul, perfeitos para o uso diário. Estes sapatos apresentam um elegante cabedal de camurça azul, solas de borracha duráveis para tração superior e cadarços clássicos na frente para um ajuste confortável. O design elegante combina bem com jeans e chinos, tornando-os uma adição versátil a qualquer guarda-roupa.",
		category: {
			name: "Calçados",
			slug: "calcados",
			image: "https://i.imgur.com/qNOjJje.jpeg",
			creationAt: "2025-10-26T20:09:12.000Z",
			updatedAt: "2025-10-26T20:09:12.000Z",
		},
		images: [
			"https://i.imgur.com/sC0ztOB.jpeg",
			"https://i.imgur.com/Jf9DL9R.jpeg",
			"https://i.imgur.com/R1IN95T.jpeg",
		],
		creationAt: "2025-10-26T20:09:12.000Z",
		updatedAt: "2025-10-26T20:09:12.000Z",
	},
];
