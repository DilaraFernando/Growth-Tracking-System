package lk.ijse.plant_growth_tracking_system.service.impl;


import lk.ijse.plant_growth_tracking_system.dto.PlantDTO;
import lk.ijse.plant_growth_tracking_system.entity.Plant;
import lk.ijse.plant_growth_tracking_system.repository.PlantRepository;
import lk.ijse.plant_growth_tracking_system.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PlantServiceImpl implements PlantService {

    private final PlantRepository plantRepository;
    private final ModelMapper modelMapper;


    @Override
    public void savePlant(PlantDTO plantDTO) {

        plantRepository.save(modelMapper.map(plantDTO, Plant.class));
    }

    @Override
    public void updatePlant(PlantDTO plantDTO) {

        plantRepository.save(modelMapper.map(plantDTO, Plant.class));
    }

    @Override
    public void deletePlant(long plantId) {

        plantRepository.deleteById(plantId);
    }

    @Override
    public List<PlantDTO> getAllPlants() {
        return modelMapper.map(plantRepository.findAll(), new TypeToken<List<PlantDTO>>() {}.getType());
    }

    @Override
    public List<PlantDTO> getPlantsByUserId(long userId) {
        return modelMapper.map(plantRepository.findByUser_UserId(userId), new TypeToken<List<PlantDTO>>() {}.getType());
    }
}
