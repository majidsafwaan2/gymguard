import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';

import '../services/auth_service.dart';
import '../services/exercise_service.dart';
import '../models/user_model.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';
import '../widgets/exercise_card.dart';
import '../widgets/progress_card.dart';
import '../widgets/quick_start_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // App Bar
            _buildAppBar(),
            
            // Main Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome Section
                    _buildWelcomeSection(),
                    
                    const SizedBox(height: 24),
                    
                    // Quick Start Section
                    _buildQuickStartSection(),
                    
                    const SizedBox(height: 24),
                    
                    // Progress Overview
                    _buildProgressSection(),
                    
                    const SizedBox(height: 24),
                    
                    // Recent Exercises
                    _buildRecentExercisesSection(),
                    
                    const SizedBox(height: 24),
                    
                    // Recommended Workouts
                    _buildRecommendedWorkoutsSection(),
                    
                    const SizedBox(height: 100), // Bottom padding for FAB
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      
      // Floating Action Button
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Navigate to exercise selection
          context.push('/exercise/select');
        },
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.fitness_center),
        label: const Text('Start Workout'),
      ),
      
      // Bottom Navigation
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
          
          switch (index) {
            case 0:
              // Already on home
              break;
            case 1:
              context.push('/workouts');
              break;
            case 2:
              context.push('/progress');
              break;
            case 3:
              context.push('/profile');
              break;
          }
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppTheme.primaryColor,
        unselectedItemColor: AppTheme.textTertiary,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: 'Workouts',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.trending_up),
            label: 'Progress',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadowColor.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Profile Avatar
          Consumer<AuthService>(
            builder: (context, authService, child) {
              final user = authService.currentUser;
              return CircleAvatar(
                radius: 24,
                backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                backgroundImage: user?.profileImageUrl != null
                    ? NetworkImage(user!.profileImageUrl!)
                    : null,
                child: user?.profileImageUrl == null
                    ? Text(
                        user?.firstName.substring(0, 1).toUpperCase() ?? 'U',
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      )
                    : null,
              );
            },
          ),
          
          const SizedBox(width: 16),
          
          // Welcome Text
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Consumer<AuthService>(
                  builder: (context, authService, child) {
                    final user = authService.currentUser;
                    return Text(
                      'Welcome back, ${user?.firstName ?? 'User'}!',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    );
                  },
                ),
                Text(
                  'Ready for today\'s workout?',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          
          // Notifications Icon
          IconButton(
            onPressed: () {
              // Navigate to notifications
              context.push('/notifications');
            },
            icon: const Icon(Icons.notifications_outlined),
            color: AppTheme.textSecondary,
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryColor,
            AppTheme.primaryVariant,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Stay Safe, Stay Strong!',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your AI fitness coach is here to help you exercise safely and effectively.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.psychology,
              color: Colors.white,
              size: 32,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStartSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Start',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: QuickStartCard(
                title: 'Start Workout',
                subtitle: 'Begin a new session',
                icon: Icons.play_arrow,
                color: AppTheme.primaryColor,
                onTap: () {
                  context.push('/exercise/select');
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: QuickStartCard(
                title: 'Form Check',
                subtitle: 'Check your technique',
                icon: Icons.camera_alt,
                color: AppTheme.secondaryColor,
                onTap: () {
                  context.push('/form-check');
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildProgressSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Your Progress',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            TextButton(
              onPressed: () {
                context.push('/progress');
              },
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        // Progress Cards
        Row(
          children: [
            Expanded(
              child: ProgressCard(
                title: 'Workout Streak',
                value: '7',
                unit: 'days',
                icon: Icons.local_fire_department,
                color: AppTheme.accentColor,
                progress: 0.7,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ProgressCard(
                title: 'Form Score',
                value: '85',
                unit: '%',
                icon: Icons.trending_up,
                color: AppTheme.successColor,
                progress: 0.85,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 16),
        
        // Weekly Progress Chart
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: AppTheme.shadowColor.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Weekly Activity',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 200,
                child: LineChart(
                  LineChartData(
                    gridData: FlGridData(show: false),
                    titlesData: FlTitlesData(
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (value, meta) {
                            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                            if (value.toInt() >= 0 && value.toInt() < days.length) {
                              return Text(
                                days[value.toInt()],
                                style: TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 12,
                                ),
                              );
                            }
                            return const Text('');
                          },
                        ),
                      ),
                      rightTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      topTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                    ),
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: const [
                          FlSpot(0, 3),
                          FlSpot(1, 1),
                          FlSpot(2, 4),
                          FlSpot(3, 2),
                          FlSpot(4, 5),
                          FlSpot(5, 3),
                          FlSpot(6, 4),
                        ],
                        isCurved: true,
                        color: AppTheme.primaryColor,
                        barWidth: 3,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: AppTheme.primaryColor.withOpacity(0.1),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentExercisesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Exercises',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            TextButton(
              onPressed: () {
                context.push('/exercises');
              },
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        // Exercise Cards
        Consumer<ExerciseService>(
          builder: (context, exerciseService, child) {
            final recentExercises = exerciseService.getRecentExercises();
            
            if (recentExercises.isEmpty) {
              return Container(
                padding: const EdgeInsets.all(40),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.fitness_center_outlined,
                      size: 48,
                      color: AppTheme.textTertiary,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No exercises yet',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Start your first workout to see your exercises here',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.textTertiary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            }
            
            return Column(
              children: recentExercises.take(3).map((exercise) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: ExerciseCard(exercise: exercise),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

  Widget _buildRecommendedWorkoutsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recommended for You',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        
        // Workout Cards
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildWorkoutCard(
                title: 'Beginner Strength',
                duration: '30 min',
                difficulty: 'Beginner',
                color: AppTheme.primaryColor,
                onTap: () {
                  context.push('/workout/beginner-strength');
                },
              ),
              const SizedBox(width: 16),
              _buildWorkoutCard(
                title: 'Core Focus',
                duration: '20 min',
                difficulty: 'Intermediate',
                color: AppTheme.secondaryColor,
                onTap: () {
                  context.push('/workout/core-focus');
                },
              ),
              const SizedBox(width: 16),
              _buildWorkoutCard(
                title: 'Cardio Blast',
                duration: '25 min',
                difficulty: 'Beginner',
                color: AppTheme.accentColor,
                onTap: () {
                  context.push('/workout/cardio-blast');
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildWorkoutCard({
    required String title,
    required String duration,
    required String difficulty,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 200,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: color.withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.fitness_center,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.access_time,
                  size: 16,
                  color: color.withOpacity(0.7),
                ),
                const SizedBox(width: 4),
                Text(
                  duration,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color.withOpacity(0.7),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(
                  Icons.trending_up,
                  size: 16,
                  color: color.withOpacity(0.7),
                ),
                const SizedBox(width: 4),
                Text(
                  difficulty,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
