const {prisma} =require ('../config/database.js');
const bcryptUtils = require('../utils/bcrypt.utils');


class UserService {



  // Créer un utilisateur
  async createUser(data) {
    // Hasher le mot de passe avant de sauvegarder
    const hashedPassword = await bcryptUtils.hash(data.password);
    
    
    return await prisma.user.create({
      data: {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        password: hashedPassword,  // ← Mot de passe hashé
        isActive: data.isActive || true,
        role: data.role || 'COMPTABLE'
      },
       select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      role: true,
      isActive: true,
      createdAt: true
    }
      
    });
  }




    async getAllUsers() {
        const allUsers =await prisma.user.findMany(
            {
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
        // password: false (on ne retourne PAS le mot de passe)
      },
      orderBy: { createdAt: 'desc' }
    });
        
        return  allUsers

  }


   // Récupérer un utilisateur par email (AVEC le mot de passe - pour login)
   // Aussi pour la verification lors de l'ajout 
  async getUserByEmail(email) {
    const UserByEmail= await prisma.user.findUnique({
      where: { email }
      // On retourne TOUT, y compris le password (pour vérification login)
    });
    return UserByEmail
  }


  // Récupérer un utilisateur par ID (sans le mot de passe)
  async getUserById(id) {
   const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user ;
  }

// Supprimer un utilisateur
  async deleteUser(id) {
     const user = await prisma.user.delete({
      where: { id }
    });
    return user ;
  }



 // Modifier un utilisateur
  async updateUser(id, data) {
    

    return await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
       
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
        // On ne retourne PAS le password
      }
    });
  }


  // Activer/Désactiver un utilisateur
  async toggleActive(id) {
    const user = await this.getUserById(id);
     if (!user) {
    throw new Error("Utilisateur non trouvé");
  }
    
   const  userUpdate = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return userUpdate
  }




}



module.exports = new UserService();