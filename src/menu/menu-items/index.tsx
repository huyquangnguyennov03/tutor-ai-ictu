// project import
import dashboard from './dashboard';
import LearningProcess from "@/menu/menu-items/learningProcess"
import cdashboard from "@/menu/menu-items/cdashboard"
import chat from "@/menu/menu-items/chat"
import chatTutor from "@/menu/menu-items/chatTutor"
import assignment from "@/menu/menu-items/assignment"
import LearningPath from "@/menu/menu-items/LearningPath"
import gameFi from "@/menu/menu-items/gameFi"
// ==============================|| MENU ITEMS ||============================== //



const menuItems = {
  items: [ dashboard, chatTutor, LearningProcess, assignment, cdashboard, chat, LearningPath, gameFi]
};

export default menuItems;