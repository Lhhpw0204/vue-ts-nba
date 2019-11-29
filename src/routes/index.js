import Home from "../components/Home"
import Compare from "../components/Compare"
import Rank from "../components/Rank"
import Schedule from "../components/Schedule"
import Team from "../components/Team"


const routes = [
    {
        path: "/home",
        name: "home",
        component: Home
    },
    {
        path: "/rank",
        name: "rank",
        component: Rank
    },
    {
        path: "/compare",
        name: "compare",
        component: Compare
    },
    {
        path: "/schedule",
        name: "schedule",
        component: Schedule
    },
    {
        path: "/team",
        name: "team",
        component: Team
    },
    {
        path: "*",
        component: Home
    }
];

export default routes;