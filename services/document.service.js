const {prisma} = require('../config/database');
const fs = require('fs').promises;

class DocumentService {



async createDocument(documentData) {
    try {
      const document = await prisma.document.create({
        data: {
          ...documentData,
          statut: 'EN_COURS'
        },
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true
            }
          }
        }
      });
      
      return document;
    } catch (error) {
      throw new Error(`Erreur création document: ${error.message}`);
    }
  }

  async getAllDocuments() {
    try {
      const documents = await prisma.document.findMany({
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return documents;
    } catch (error) {
      throw new Error(`Erreur récupération documents: ${error.message}`);
    }
  }


  // Récupérer que mes documents . apes login 


    async getMyDocuments(userId) {
    try {
      const documents = await prisma.document.findMany({
        where: {   uploadedBy: userId},
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return documents;
    } catch (error) {
      throw new Error(`Erreur récupération mes documents: ${error.message}`);
    }
  }
  // document par id 

async getDocumentById(id) {
    
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true
            }
          }
        }
      });
      
      return document;
    }

  // DELETE

async deleteDocument(id) {
    try {
      // Récupérer le document
      const document = await prisma.document.findUnique({
        where: { id }
      });
      
      
      
      // Supprimer le fichier physique
      try {
        await fs.unlink(document.filePath);
        console.log('Fichier physique supprimé:', document.filePath);
      } catch (error) {
        console.error('Erreur suppression fichier:', error.message);
      }
      
      // Supprimer de la BDD
      await prisma.document.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      throw new Error(`Erreur suppression document: ${error.message}`);
    }
  }












}
module.exports = new DocumentService();