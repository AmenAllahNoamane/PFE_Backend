const userService = require('../services/user.service');



class UserController {

  // POST /api/users - Créer un utilisateur
  async create(req, res) {
    try {
      const { email, password, nom ,prenom ,isActive,  role } = req.body;
     
      // Validation
      if (!email || !password || !nom || !prenom) {
        return res.status(400).json({ 
          error: 'Email, mot de passe, nom et prénom sont obligatoires' 
        });
      }

      // Vérifier longueur mot de passe
      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Le mot de passe doit contenir au moins 6 caractères' 
        });
      }

      // Vérifier si l'email existe déjà
      const existing = await userService.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ 
          error: 'Cet email est déjà utilisé' 
        });
      }

      // Créer l'utilisateur (le mot de passe sera hashé automatiquement)
      const user = await userService.createUser({ 
        email, 
        password, 
        nom, 
        prenom, 
        role ,
        isActive
      });
      
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user  // Le password n'est PAS dans la réponse
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

















  // GET /api/users - Liste tous les utilisateurs
  async getAll(req, res) {
 try {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
      return res.status(200).json({ message: "Aucun utilisateur trouvé" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }


  // GET /users/ getUserByEmail -   recherhe par email 


  async getUserByEmail(req, res) {
 try {
    const{ email }=req.body;
    const user= await userService.getUserByEmail(email);
    delete user.password; // hethi najm na7iha ou nbadel fel select t3 user mn service 
    if (user.length === 0) {
      return res.status(200).json({ message: "Aucun utilisateur trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }


  // GET /api/users/:id - Détails d'un utilisateur
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }





}


module.exports = new UserController();
