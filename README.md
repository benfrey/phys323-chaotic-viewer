# PHYS 323: WP3 (Final Presentation) Web-based ChaoticViewer

## Project Overview

Project Assignment Outline PDF: [project_assignment.pdf](docs/project_assignment.pdf) </br>

## Project Description

The main purpose of this project is to demonstrate the implementation of a web-based ChaoticViewer similar to the Virtual Instrumentation (VI) that was created in LabView. This program allows users to select a binary (.bin) file (i.e., data created with the ChaoticDAQ VI program) to load into the web interface. Each binary file has an associated text (.txt) file and an attempt will be made to load this file in as well.

## Installation Process and Execution
1. $git clone https://github.com/benfrey/phys323-chaotic-viewer
2. $cd phys323-chaotic-viewer
3. $pip install -r requirements.txt
4. $bokeh serve --show ChaoticViewer.py
5. Visit "http://localhost:5006/ChaoticViewer" in your browser.
</br>
NOTE: I am using Python 3.9.7 and pip 21.2.4 at the time of writing this.

## Runtime Demonstration
First, the system state is calculated for 600 simulation steps. The calculation process is tracked by the program:
![Program execution in terminal](docs/program_execution.png)
Next, the simulation results are statically drawn to a figure on screen with Matplotlib:
![Simulation results plot](docs/orbital_plot.png)
Finally, once exiting the static figure, the simulation results are animated to the screen with Pygame:
![Animated simulation results](docs/orbital_animation.gif)
