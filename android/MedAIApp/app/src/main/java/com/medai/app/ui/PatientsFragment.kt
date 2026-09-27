package com.medai.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.medai.app.databinding.FragmentPatientsBinding

class PatientsFragment : Fragment() {
    private var _binding: FragmentPatientsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentPatientsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.title.text = "Список пациентов"
        binding.patient1Name.text = "Иван Петров"
        binding.patient1Meta.text = "ЭКГ готов к проверке"
        binding.patient2Name.text = "Елена Смирнова"
        binding.patient2Meta.text = "Запланирован осмотр"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
