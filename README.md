<!-- Banner -->
<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>


<h1 align="center"><b>Đồ họa máy tính - CS105.P22</b></h1>


## 👥 Team Members

| Student Name | Student ID |
|--------------|------------|
|Nguyễn Phú Tài       | 22521280        |
|Mai Văn Tân          | 22521568        |
|Trần Lê Nguyên Trung | 22521568        |


## 🚗 3D Car Physics Simulation

A realistic 3D car physics simulation built with React Three Fiber and Cannon.js for the Computer Graphics course at UIT. This project features real-time car physics, dynamic weather effects, multiple camera modes, and immersive 3D environments.

### ✨ Features

#### 🎮 Car Physics & Controls
- **Realistic Vehicle Physics**: Powered by Cannon.js physics engine
- **Customizable Car Models**: Multiple car variants (v1, v2, v3) with GLB format
- **Advanced Controls**: WASD movement, spacebar handbrake, horn sound effects
- **Adjustable Physics Parameters**: Engine force, steering sensitivity, suspension stiffness, friction

#### 📷 Camera System
- **Orbit Camera**: Free-roam camera for scene exploration
- **Third Person**: Follow the car from behind
- **Top Down**: Aerial view for better navigation
- **Free Camera**: Manual camera control with pointer lock

#### 🌦️ Dynamic Weather System
- **Rain Effects**: Particle-based rain with intensity controls
- **Snow Effects**: Realistic snowfall simulation
- **Weather Sounds**: Background audio for immersive experience
- **Day/Night Cycle**: Toggle between environments with HDR skyboxes

#### 🏁 Interactive Environment
- **3D Race Track**: Detailed track with textures and obstacles
- **Moving Obstacles**: Dynamic objects that interact with physics
- **Ramps & Jumps**: Physics-based ramp interactions
- **Scattered Objects**: Barrels and debris with collision detection
- **Helicopter**: Animated helicopter model
- **Light Poles**: Realistic street lighting

#### 🎵 Audio System
- **Engine Sounds**: Dynamic engine audio based on car speed
- **Collision Effects**: Impact sounds for realistic feedback
- **Horn Sound**: Interactive horn with spacebar
- **Environmental Audio**: Background music and weather sounds

#### 🛠️ Development Tools
- **Leva Controls**: Real-time parameter adjustment
- **Physics Debug**: Wheel and collision visualization
- **Performance Monitoring**: Optimized rendering with React Suspense

### 🚀 Getting Started

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the simulation

### 🎮 Controls

| Key | Action |
|-----|--------|
| `W` | Accelerate Forward |
| `S` | Reverse / Brake |
| `A` | Steer Left |
| `D` | Steer Right |
| `Space` | Handbrake |
| `H` | Horn |
| `R` | Reset Car Position |
| `C` | Toggle Camera Mode |
| `Mouse` | Orbit Camera (in orbit mode) |

### 🛠️ Technical Stack

- **Frontend Framework**: React 18
- **3D Graphics**: Three.js with React Three Fiber
- **Physics Engine**: Cannon.js with React Three Cannon
- **3D Models**: GLB/GLTF format models
- **Audio**: use-sound for audio management
- **UI Controls**: Leva for real-time parameter adjustment
- **Animations**: React Spring for smooth transitions

### 📁 Project Structure

```
src/
├── Car.jsx              # Main car component with physics
├── Scene.jsx            # Main scene setup and camera management
├── Ground.jsx           # Ground plane with textures
├── Track.jsx            # 3D race track component
├── Rain.jsx             # Rain particle effects
├── Snow.jsx             # Snow particle effects
├── Helicopter.jsx       # Animated helicopter model
├── LightPole.jsx        # Street lighting
├── MovingObstacle.jsx   # Dynamic obstacles
├── ScatteredObjects.jsx # Static environment objects
├── Ramp.jsx             # Physics-based ramps
├── ColliderBox.jsx      # Collision detection utilities
├── WeatherSound.jsx     # Weather audio effects
├── useCarModels.jsx     # Car model loading hook
├── useControls.jsx      # Input handling hook
├── useWheels.jsx        # Wheel physics configuration
├── useLevaControls.jsx  # UI controls hook
├── useAudio.jsx         # Audio management hook
└── WheelDebug.jsx       # Physics visualization

public/
├── models/              # 3D model assets (.glb)
├── textures/            # Texture files and skyboxes
└── audio/               # Sound effects and music
```

### 🎨 Assets

#### 3D Models
- **Car Models**: Multiple car variants in GLB format
- **Environment**: Track, obstacles, helicopter, light poles
- **Track**: Optimized with Draco compression

#### Textures
- **Environment Maps**: HDR skyboxes for realistic lighting
- **Ground Textures**: High-quality terrain textures
- **Planet Textures**: 2K resolution planetary textures
- **Material Maps**: Alpha maps and displacement textures

#### Audio
- **Engine Sounds**: Realistic car engine audio
- **Environmental**: Rain, collision, background music
- **Interactive**: Horn and impact sound effects

### ⚙️ Configuration

The simulation includes extensive customization options through Leva controls:

#### Weather Settings
- Rain/Snow toggle and intensity
- Weather sound effects

#### Car Physics
- Engine force and power
- Steering sensitivity
- Suspension stiffness
- Friction and grip levels

#### Camera Settings
- Camera mode switching
- Smooth transitions between views

### 🔧 Development

#### Building for Production
```bash
npm run build
```

#### Running Tests
```bash
npm test
```

#### Code Structure
- Components follow React functional patterns
- Physics simulation uses hooks for state management
- Modular design for easy feature extension

### 📈 Performance Optimization

- **Suspense Boundaries**: Async model loading
- **Instance Rendering**: Efficient particle systems
- **LOD System**: Level-of-detail for distant objects
- **Texture Optimization**: Compressed formats and mipmapping
- **Physics Optimization**: Selective collision detection

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 Course Information

**Course**: Đồ họa máy tính (Computer Graphics) - CS105.P22  
**Institution**: Trường Đại học Công nghệ Thông tin (University of Information Technology)  
**Academic Year**: 2024-2025

### 📄 License

This project is created for educational purposes as part of the CS105 Computer Graphics course.

---

<p align="center">
  <i>Built with ❤️ using React Three Fiber & Cannon.js</i>
</p>



