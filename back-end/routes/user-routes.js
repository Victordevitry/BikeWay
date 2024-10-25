const express = require('express');
const BikeRoute = require('../models/bike-route'); 

const router = express.Router();

router.post('/save', async (req, res) => {
  try {
    const { origin, destination, userEmail } = req.body;

    // Enregistrez l'itinéraire dans la base de données
    const route = await BikeRoute.create({ userEmail, origin, destination });

    res.status(200).send(route);
  } catch (err) {
    res.status(500).send({ message: 'Erreur lors de l\'enregistrement' });
  }
});

router.get('/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    
    try {
      const routes = await BikeRoute.find({ userEmail });
      res.status(200).send(routes);
    } catch (err) {
      res.status(500).send({ message: 'Erreur lors de la récupération des itinéraires' });
    }
});

router.put('/rate/:id', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    if (rating < 1 || rating > 5) {
      return res.status(400).send({ message: 'La note doit être entre 1 et 5' });
    }
  
    try {
      const route = await BikeRoute.findByIdAndUpdate(
        id,
        { rating },
        { new: true } // Return the updated document
      );
  
      if (!route) {
        return res.status(404).send({ message: 'Itinéraire non trouvé' });
      }
  
      res.status(200).send(route);
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la mise à jour de la note', error });
    }
  });
  

router.delete('/delete/:id', async (req, res) => {
    const routeId = req.params.id;
  
    try {
      await BikeRoute.findByIdAndDelete(routeId);
      res.status(200).send({ message: 'Itinéraire supprimé avec succès' });
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la suppression', error });
    }
  });
  
module.exports = router;
