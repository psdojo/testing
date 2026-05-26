const app = express();

app.use(express.json());

type RedirectStep = {
  url: string;
  status: number;
  time: number;
};

async function checkRedirect(url: string): Promise<RedirectStep[]> {}
