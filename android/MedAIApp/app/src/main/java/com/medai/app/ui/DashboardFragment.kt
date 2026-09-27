package com.medai.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.medai.app.databinding.FragmentDashboardBinding

class DashboardFragment : Fragment() {
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.title.text = "Оперативная сводка"
        binding.subtitle.text = "Сегодня: 12 задач, 4 пациента в очереди"
        binding.card1Title.text = "План на день"
        binding.card1Value.text = "8 процедур"
        binding.card2Title.text = "ЭКГ" 
        binding.card2Value.text = "3 изображения"
        binding.card3Title.text = "Безопасность"
        binding.card3Value.text = "Модель ограничена" 
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
