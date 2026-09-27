package com.medai.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.medai.app.databinding.ActivityMainBinding
import com.medai.app.ui.DashboardFragment
import com.medai.app.ui.EcgFragment
import com.medai.app.ui.PatientsFragment

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNavigation.setOnItemSelectedListener { item ->
            val fragment = when (item.itemId) {
                R.id.nav_dashboard -> DashboardFragment()
                R.id.nav_ecg -> EcgFragment()
                R.id.nav_patients -> PatientsFragment()
                else -> DashboardFragment()
            }

            supportFragmentManager
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit()

            true
        }

        binding.bottomNavigation.selectedItemId = R.id.nav_dashboard
    }
}
